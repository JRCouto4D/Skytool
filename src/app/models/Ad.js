import Sequelize, { Model } from 'sequelize';

class Ad extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
        sector: Sequelize.STRING,
        status: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'ads',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.File, { foreignKey: 'image_id', as: 'image' });
  }
}

export default Ad;
