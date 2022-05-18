'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BotModel extends Model {
    static associate(models) {
      BotModel.belongsTo(models.UserModel, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
      BotModel.hasMany(models.FlowsAttachmentModel, {
        foreignKey: 'botId',
      });
    }
  }

  BotModel.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      botId: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING(36),
      },
      name: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING(30),
      },
      description: {
        allowNull: false,
        type: DataTypes.STRING(50),
      },
      startText: {
        allowNull: false,
        type: DataTypes.STRING(300),
      },
      helpText: {
        allowNull: false,
        type: DataTypes.STRING(300),
      },
      settingsText: {
        allowNull: false,
        type: DataTypes.STRING(300),
      },
      botUsername: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING(32),
      },
      botToken: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING(46),
      },
    },
    {
      sequelize,
      tableName: 'bots',
      timestamps: true,
    }
  );

  return BotModel;
};
