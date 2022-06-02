'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('botContainers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      containerId: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      botId: {
        allowNull: false,
        type: Sequelize.STRING(36),
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
    await queryInterface.dropTable('botContainers');
  },
};
