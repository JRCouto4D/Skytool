module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'evaluation', {
      type: Sequelize.DOUBLE,
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('users', 'evaluation');
  },
};
