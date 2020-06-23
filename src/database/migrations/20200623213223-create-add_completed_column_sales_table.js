module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('sales', 'completed_at', {
      type: Sequelize.DATE,
      defaltValue: false,
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('sales', 'completed_at');
  },
};
