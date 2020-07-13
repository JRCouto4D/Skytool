module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('itens', 'comments', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('itens', 'comments');
  },
};
