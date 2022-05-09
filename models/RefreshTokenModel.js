'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RefreshTokenModel extends Model {
    static associate(models) {
      RefreshTokenModel.belongsTo(models.UserModel, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
    }
  }

  RefreshTokenModel.init(
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
      refreshToken: {
        allowNull: false,
        type: DataTypes.STRING(512),
      },
    },
    {
      sequelize,
      tableName: 'refreshTokens',
      timestamps: true,
    }
  );

  return RefreshTokenModel;
};
