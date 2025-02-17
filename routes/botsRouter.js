'use strict';

const express = require('express');

const authMiddleware = require('middlewares/authMiddleware');
const asyncHandler = require('utils/asyncHandler');
const {
  getUserBots,
  getUserBot,
  getUserBotsForAttachment,
  createBot,
  updateBot,
  deleteBot,
} = require('controllers/botsController');
const { botSchema } = require('utils/validators/botValidator');
const { isUUIDv4 } = require('utils/validators/commonValidator');

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
    } = req;

    const bots = await getUserBots(id);

    res.json({ bots });
  })
);

router.get(
  '/:botId',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      params: { botId },
    } = req;

    isUUIDv4.validateSync(botId);

    const bot = await getUserBot(id, botId);

    res.json({ bot });
  })
);

router.get(
  '/attachment/list',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
    } = req;

    const bots = await getUserBotsForAttachment(id);

    res.json({ bots });
  })
);

router.post(
  '/',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      body,
    } = req;

    const botData = botSchema.validateSync(body);
    const bot = await createBot(id, botData);

    res.json({ bot });
  })
);

router.put(
  '/:botId',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      params: { botId },
      body,
    } = req;

    isUUIDv4.validateSync(botId);
    const botData = botSchema.validateSync(body);
    await updateBot(id, botId, botData);

    res.status(200).end();
  })
);

router.delete(
  '/:botId',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      params: { botId },
    } = req;

    isUUIDv4.validateSync(botId);
    await deleteBot(id, botId);

    res.status(200).end();
  })
);

module.exports = router;
