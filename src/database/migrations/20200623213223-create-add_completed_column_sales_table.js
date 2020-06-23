module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('sales', 'completed_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('sales', 'completed_at');
  },
};
