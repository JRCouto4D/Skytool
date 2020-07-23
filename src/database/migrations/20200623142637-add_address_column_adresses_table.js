module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('sales', 'address_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'adresses',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('sales', 'address_id');
  },
};
