import Sequelize, { Model } from 'sequelize';

class Sale extends Model {
  static init(sequelize) {
    super.init(
      {
        total: Sequelize.DOUBLE,
        payment: Sequelize.STRING,
        change_for: Sequelize.DOUBLE,
        production: Sequelize.DATE,
        delivered: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        finished: Sequelize.DATE,
        completed_at: Sequelize.DATE,
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
    this.belongsTo(models.Address, { foreignKey: 'address_id', as: 'address' });
  }
}

export default Sale;
