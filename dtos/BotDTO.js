'use strict';

class BotDTO {
  constructor(model) {
    this.botId = model.botId;
    this.name = model.name;
    this.description = model.description;
    this.startText = model.startText;
    this.helpText = model.helpText;
    this.settingsText = model.settingsText;
    this.botUsername = model.botUsername;
    this.botToken = model.botToken;
    this.updatedAt = model.updatedAt;
  }
}

module.exports = BotDTO;
