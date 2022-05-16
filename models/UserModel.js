'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserModel extends Model {
    static associate(models) {
      UserModel.hasMany(models.RefreshTokenModel, {
        foreignKey: 'userId',
      });
      UserModel.hasMany(models.BotModel, {
        foreignKey: 'userId',
      });
      UserModel.hasMany(models.FlowModel, {
        foreignKey: 'userId',
      });
    }
  }

  UserModel.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING(100),
        validate: {
          isEmail: true,
        },
      },
      passwordHash: {
        allowNull: false,
        type: DataTypes.STRING(512),
      },
      salt: {
        allowNull: false,
        type: DataTypes.STRING(512),
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
    }
  );

  return UserModel;
};
