'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FlowModel extends Model {
    static associate(models) {
      FlowModel.belongsTo(models.UserModel, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
      FlowModel.hasMany(models.FlowsAttachmentModel, {
        foreignKey: 'flowId',
      });
    }
  }

  FlowModel.init(
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
      flowId: {
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
      flowData: {
        allowNull: false,
        type: DataTypes.JSONB,
      },
    },
    {
      sequelize,
      tableName: 'flows',
      timestamps: true,
    }
  );

  return FlowModel;
};
