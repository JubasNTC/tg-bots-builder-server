'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FlowsAttachmentModel extends Model {
    static associate(models) {
      FlowsAttachmentModel.belongsTo(models.BotModel, {
        foreignKey: 'botId',
        onDelete: 'CASCADE',
      });
      FlowsAttachmentModel.belongsTo(models.FlowModel, {
        foreignKey: 'flowId',
        onDelete: 'CASCADE',
      });
    }
  }

  FlowsAttachmentModel.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      botId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      flowId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: 'flowsAttachment',
      timestamps: true,
    }
  );

  return FlowsAttachmentModel;
};
