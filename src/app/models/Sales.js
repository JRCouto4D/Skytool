import Sequelize, { Model } from 'sequelize';

class Sales extends Model {
  static init(sequelize) {
    super.init(
      {
        total: Sequelize.DATE,
        payment: Sequelize.STRING,
        change_for: Sequelize.DOUBLE,
        production: Sequelize.DATE,
        delivered: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Sales;
