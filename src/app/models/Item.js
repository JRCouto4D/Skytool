import Sequelize, { Model } from 'sequelize';

class Item extends Model {
  static init(sequelize) {
    super.init(
      {
        amount: Sequelize.INTEGER,
        comments: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'itens',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
    this.belongsTo(models.Sale, { foreignKey: 'sale_id', as: 'sale' });
  }
}

export default Item;
