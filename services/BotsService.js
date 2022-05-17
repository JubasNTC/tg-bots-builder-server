'use strict';

const { randomUUID } = require('crypto');

const { BotModel } = require('models');
const BotDTO = require('dtos/BotDTO');

class BotsService {
  static async getUserBots(userId) {
    const bots = await BotModel.findAll({ where: { userId } });

    return bots.map((bot) => new BotDTO(bot));
  }

  static async getUserBot(userId, botId) {
    const bot = await BotModel.findOne({ where: { userId, botId } });

    return bot ? new BotDTO(bot) : null;
  }

  static async getUserBotsForAttachment(userId) {
    return BotModel.findAll({
      attributes: [
        ['botId', 'key'],
        ['name', 'text'],
        ['botId', 'value'],
      ],
      where: { userId },
    });
  }

  static async createBot(userId, botData) {
    const bot = await BotModel.create({
      ...botData,
      userId,
      botId: randomUUID(),
    });

    return new BotDTO(bot);
  }

  static async updateBot(userId, botId, botData) {
    return BotModel.update(botData, { where: { userId, botId } });
  }

  static async deleteBot(userId, botId) {
    return BotModel.destroy({ where: { userId, botId } });
  }
}

module.exports = BotsService;
