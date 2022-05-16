'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      botId: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(36),
      },
      name: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(30),
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },
      startText: {
        allowNull: false,
        type: Sequelize.STRING(300),
      },
      helpText: {
        allowNull: false,
        type: Sequelize.STRING(300),
      },
      settingsText: {
        allowNull: false,
        type: Sequelize.STRING(300),
      },
      botUsername: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(32),
      },
      botToken: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(46),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('bots');
  },
};
