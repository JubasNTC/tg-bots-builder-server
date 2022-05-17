'use strict';

const { QueryTypes } = require('sequelize');
const { randomUUID } = require('crypto');

const { FlowModel, sequelize } = require('models');
const FlowDTO = require('dtos/FlowDTO');

class FlowsService {
  static async getUserFlows(userId) {
    const flows = await FlowModel.findAll({ where: { userId } });

    return flows.map((flow) => new FlowDTO(flow));
  }

  static async getUserFlowForForm(userId, flowId) {
    const flow = await FlowModel.findOne({ where: { userId, flowId } });

    if (!flow) {
      return null;
    }

    const {
      name,
      description,
      flowData: { triggers },
    } = flow;

    const botsAttachment = await sequelize.query(
      `SELECT
         "b"."botId" AS "value"
       FROM "flowsAttachment" AS "fa"
       INNER JOIN "bots" AS "b" ON "fa"."botId" = "b"."id"
       INNER JOIN "flows" AS "f" ON "fa"."flowId" = "f"."id"
       WHERE "f"."flowId" = :flowId;`,
      {
        replacements: {
          flowId,
        },
        type: QueryTypes.SELECT,
      }
    );

    return {
      name,
      description,
      triggers: triggers.join('\n'),
      botsAttachment: botsAttachment.map(({ value }) => value),
    };
  }

  static async createFlow(userId, initialFlowData) {
    const { name, description, triggers, botsAttachment } = initialFlowData;
    const flowId = randomUUID();
    const transaction = await sequelize.transaction();

    try {
      const flow = await FlowModel.create(
        {
          userId,
          flowId,
          name,
          description,
          flowData: {
            flowId,
            triggers: triggers.split('\n'),
            initialSession: {},
            tasks: [],
          },
        },
        { transaction }
      );

      if (botsAttachment.length > 0) {
        await FlowsService.addFlowBotsAttachment(
          flow.id,
          botsAttachment,
          transaction
        );
      }

      await transaction.commit();

      return new FlowDTO(flow);
    } catch (e) {
      await transaction.rollback();

      throw e;
    }
  }

  static async updateFlow(userId, flowId, flowData) {
    const { name, description, triggers, botsAttachment } = flowData;
    const transaction = await sequelize.transaction();

    try {
      await FlowModel.update(
        {
          name,
          description,
          flowData: {
            triggers: triggers.split('\n'),
          },
        },
        { transaction, where: { userId, flowId } }
      );

      await sequelize.query(
        `DELETE FROM "flowsAttachment"
         WHERE "flowId" = (
           SELECT
             "id"
           FROM "flows"
           WHERE "flowId" = :flowId
         );`,
        {
          transaction,
          replacements: {
            flowId,
          },
          type: QueryTypes.DELETE,
        }
      );

      const {
        dataValues: { id },
      } = await FlowModel.findOne({
        attributes: ['id'],
        where: { flowId },
      });

      await FlowsService.addFlowBotsAttachment(id, botsAttachment, transaction);

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();

      throw e;
    }

    return FlowModel.update(flowData, { where: { userId, flowId } });
  }

  static async setFlowEnabled(userId, flowId, enabled) {
    return FlowModel.update({ enabled }, { where: { userId, flowId } });
  }

  static async deleteFlow(userId, flowId) {
    return FlowModel.destroy({ where: { userId, flowId } });
  }

  static async addFlowBotsAttachment(id, botsAttachment, transaction) {
    const queryOptions = {
      replacements: {
        flowId: id,
        botAttachmentIds: botsAttachment,
      },
      type: QueryTypes.INSERT,
    };

    if (transaction) {
      queryOptions.transaction = transaction;
    }

    return sequelize.query(
      `INSERT INTO "flowsAttachment" ("botId", "flowId")
         SELECT
           "id" AS "botId",
            :flowId  AS "flowId"
         FROM "bots"
         WHERE "botId" IN(:botAttachmentIds);`,
      queryOptions
    );
  }
}

module.exports = FlowsService;
