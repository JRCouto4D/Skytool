module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deliveries', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      provider_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      mensage: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('deliveries');
  },
};
