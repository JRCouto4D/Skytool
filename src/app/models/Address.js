import Sequelize, { Model } from 'sequelize';

class Address extends Model {
  static init(sequelize) {
    super.init(
      {
        street: Sequelize.STRING,
        number: Sequelize.STRING,
        neighborhood: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
        zip_code: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'adresses',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default new Address();
