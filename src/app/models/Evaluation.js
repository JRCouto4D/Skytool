import Sequelize, { Model } from 'sequelize';

class Evaluation extends Model {
  static init(sequelize) {
    super.init(
      {
        note: Sequelize.DOUBLE,
      },
      {
        sequelize,
        tableName: 'assessments',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Evaluation;
