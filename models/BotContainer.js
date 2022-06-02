'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BotContainer extends Model {
    static associate(models) {
      // define association here
    }
  }

  BotContainer.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      containerId: {
        allowNull: false,
        type: DataTypes.STRING(100),
      },
      botId: {
        allowNull: false,
        type: DataTypes.STRING(36),
      },
    },
    {
      sequelize,
      tableName: 'botContainers',
      timestamps: true,
    }
  );

  return BotContainer;
};
