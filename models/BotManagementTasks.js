'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BotManagementTasks extends Model {
    static associate(models) {
      // define association here
    }
  }

  BotManagementTasks.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      botId: {
        allowNull: false,
        type: DataTypes.STRING(36),
      },
      task: {
        allowNull: false,
        type: DataTypes.ENUM({
          values: ['new', 'edit', 'delete', 'enable', 'disable'],
        }),
      },
    },
    {
      sequelize,
      tableName: 'botManagementTasks',
      timestamps: true,
    }
  );

  return BotManagementTasks;
};
