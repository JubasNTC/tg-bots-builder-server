'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('botManagementTasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      botId: {
        allowNull: false,
        type: Sequelize.STRING(36),
      },
      task: {
        allowNull: false,
        type: Sequelize.ENUM({
          values: ['new', 'edit', 'delete', 'enable', 'disable'],
        }),
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
    await queryInterface.dropTable('botManagementTasks');
    await queryInterface.sequelize.query(
      'DROP TYPE "enum_botManagementTasks_task";'
    );
  },
};
