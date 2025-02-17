'use strict';

const sequelize = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(100),
        validate: {
          isEmail: true,
        },
      },
      passwordHash: {
        allowNull: false,
        type: Sequelize.STRING(512),
      },
      salt: {
        allowNull: false,
        type: Sequelize.STRING(512),
      },
      createdAt: {
        allowNull: false,
        defaultValue: sequelize.literal('NOW()'),
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        defaultValue: sequelize.literal('NOW()'),
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
