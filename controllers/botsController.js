'use strict';

const BotsService = require('services/BotsService');

const getUserBots = async (userId) => BotsService.getUserBots(userId);

const getUserBot = async (userId, botId) =>
  BotsService.getUserBot(userId, botId);

const createBot = async (userId, botData) =>
  BotsService.createBot(userId, botData);

const updateBot = async (userId, botId, botData) =>
  BotsService.updateBot(userId, botId, { ...botData, userId, botId });

const deleteBot = async (userId, botId) => BotsService.deleteBot(userId, botId);

module.exports = { getUserBots, getUserBot, createBot, updateBot, deleteBot };
