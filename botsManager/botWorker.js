'use strict';

const flowData = require('/usr/src/volumes/data.json');

const BotFactory = require('./BotFactory');

const bot = BotFactory.factory(
  '5319207819:AAFaFXXmPEZNPtyhJly71SUMnNkSZJy1Alo',
  flowData
);

bot.launch().then(() => console.dir({ start: true }));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
