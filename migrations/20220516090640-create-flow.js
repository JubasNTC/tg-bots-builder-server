'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('flows', {
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
      flowId: {
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
      flowData: {
        allowNull: false,
        type: Sequelize.JSONB,
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
    await queryInterface.dropTable('flows');
  },
};
