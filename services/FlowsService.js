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

  static async getUserFlowTasks(userId, flowId) {
    const flow = await FlowModel.findOne({ where: { userId, flowId } });

    if (!flow) {
      return null;
    }

    const {
      flowData: { triggers, tasks },
    } = flow;

    return [
      {
        name: 'Триггеры',
        taskType: 'triggers',
        taskId: 'ttt',
        triggers,
      },
    ].concat(tasks);
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
            toFront: {},
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

    const { flowData: oldFlowData } = await FlowModel.findOne({
      where: { userId, flowId },
    });

    try {
      await FlowModel.update(
        {
          name,
          description,
          flowData: {
            ...oldFlowData,
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

  static buildTaskData(taskId, taskType, _taskData) {
    const result = {
      taskId,
      taskType,
      name: _taskData.name,
      taskData: {},
    };

    if (taskType === 'message') {
      result.taskData.text = _taskData.text;
    }

    if (taskType === 'question') {
      result.taskData.type = _taskData.type;
      result.taskData.question = _taskData.question;

      if (_taskData.type === 'text') {
        result.taskData.validation = _taskData.validation;
        result.taskData.customValidationMessage =
          _taskData.customValidationMessage;
        result.taskData.numberOfInvalidAnswers =
          _taskData.numberOfInvalidAnswers;
      }

      if (_taskData.type === 'choice') {
        const choices = [];

        if (_taskData.choiceAnswerValue1) {
          choices.push({
            text: _taskData.choiceAnswerText1,
            value: _taskData.choiceAnswerValue1,
          });
        }

        if (_taskData.choiceAnswerValue2) {
          choices.push({
            text: _taskData.choiceAnswerText2,
            value: _taskData.choiceAnswerValue2,
          });
        }

        if (_taskData.choiceAnswerValue3) {
          choices.push({
            text: _taskData.choiceAnswerText3,
            value: _taskData.choiceAnswerValue3,
          });
        }

        if (_taskData.choiceAnswerValue4) {
          choices.push({
            text: _taskData.choiceAnswerText4,
            value: _taskData.choiceAnswerValue4,
          });
        }

        if (_taskData.choiceAnswerValue5) {
          choices.push({
            text: _taskData.choiceAnswerText5,
            value: _taskData.choiceAnswerValue5,
          });
        }

        if (_taskData.choiceAnswerValue6) {
          choices.push({
            text: _taskData.choiceAnswerText6,
            value: _taskData.choiceAnswerValue6,
          });
        }

        result.taskData.choices = choices;
      }
    }

    if (_taskData.type === 'image') {
      result.taskData.url = _taskData.url;
    }

    if (_taskData.type === 'video') {
      result.taskData.url = _taskData.url;
    }

    if (_taskData.type === 'card') {
      result.taskData.title = _taskData.title;
      result.taskData.text = _taskData.text;
      result.taskData.imageUrl = _taskData.imageUrl;
      result.taskData.linkText = _taskData.linkText;
      result.taskData.linkUrl = _taskData.linkUrl;
    }

    if (_taskData.type === 'notifyTelegram') {
      result.taskData.title = _taskData.title;
      result.taskData.chatIds = _taskData.chatIds;
    }

    if (_taskData.type === 'http') {
      result.taskData.method = _taskData.method;
      result.taskData.httpHeaders = _taskData.httpHeaders;
      result.taskData.httpBody = _taskData.httpBody;
      result.taskData.timeout = _taskData.timeout;
      result.taskData.basicUsername = _taskData.basicUsername;
      result.taskData.basicPassword = _taskData.basicPassword;
      result.taskData.isUseProxy = _taskData.isUseProxy;
      result.taskData.proxyUrl = _taskData.proxyUrl;
    }

    return result;
  }

  static buildTaskInitialSession(taskType, _taskData) {
    const result = {
      filters: null,
    };

    if (taskType === 'question') {
      result.answer = '';

      if (_taskData.type === 'text' && !!_taskData.validation) {
        result.numberOfInvalidAnswers = _taskData.numberOfInvalidAnswers;
      }
    }

    if (_taskData.type === 'notifyTelegram') {
      result.resolved = false;
    }

    if (_taskData.type === 'http') {
      result.response = false;
      result.status = '';
    }

    return result;
  }

  static async createUserFlowTask(
    userId,
    flowId,
    prevTaskId,
    taskType,
    taskData
  ) {
    const { flowData } = await FlowModel.findOne({
      where: { userId, flowId },
    });

    const { initialSession, tasks, toFront } = flowData;

    const taskId = randomUUID();
    const builtTaskData = FlowsService.buildTaskData(
      taskId,
      taskType,
      taskData
    );

    if (tasks.length > 0) {
      const prevTaskIndex = tasks.findIndex(
        ({ taskId }) => taskId === prevTaskId
      );
      tasks.splice(prevTaskIndex + 1, 0, builtTaskData);
    } else {
      tasks.push(builtTaskData);
    }

    initialSession[taskId] = FlowsService.buildTaskInitialSession(
      taskType,
      taskData
    );

    toFront[taskId] = taskData;

    await FlowModel.update(
      {
        flowData: {
          ...flowData,
          initialSession,
          tasks,
          toFront,
        },
      },
      {
        where: { userId, flowId },
      }
    );

    return taskId;
  }

  static async getUserFlowTask(userId, flowId, taskId) {
    const {
      flowData: { toFront },
    } = await FlowModel.findOne({
      where: { userId, flowId },
    });

    return toFront[taskId];
  }

  static async updateUserFlowTask(userId, flowId, taskId, taskData) {
    const { flowData } = await FlowModel.findOne({
      where: { userId, flowId },
    });

    const { initialSession, tasks, toFront } = flowData;
    const taskIndex = tasks.findIndex(
      ({ taskId: _taskId }) => _taskId === taskId
    );
    initialSession[taskId] = FlowsService.buildTaskInitialSession(
      tasks[taskIndex].taskType,
      taskData
    );
    toFront[taskId] = taskData;
    const builtTaskData = FlowsService.buildTaskData(
      taskId,
      tasks[taskIndex].taskType,
      taskData
    );
    tasks[taskIndex] = builtTaskData;

    await FlowModel.update(
      {
        flowData: {
          ...flowData,
          initialSession,
          tasks,
          toFront,
        },
      },
      {
        where: { userId, flowId },
      }
    );
  }

  static async deleteUserFlowTask(userId, flowId, taskId) {
    const { flowData } = await FlowModel.findOne({
      where: { userId, flowId },
    });

    const { initialSession, tasks, toFront } = flowData;

    const taskIndex = tasks.findIndex(
      ({ taskId: _taskId }) => _taskId === taskId
    );
    delete initialSession[taskId];
    delete toFront[taskId];
    tasks.splice(taskIndex, 1);

    await FlowModel.update(
      {
        flowData: {
          ...flowData,
          initialSession,
          tasks,
          toFront,
        },
      },
      {
        where: { userId, flowId },
      }
    );
  }
}

module.exports = FlowsService;
