module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('adresses', 'enabled', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('adresses', 'enabled');
  },
};
