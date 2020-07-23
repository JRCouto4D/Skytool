import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import User from '../app/models/User';
import File from '../app/models/File';
import Address from '../app/models/Address';
import Phone from '../app/models/Phone';
import Advertisement from '../app/models/Advertisement';
import Product from '../app/models/Product';
import Sale from '../app/models/Sale';
import Item from '../app/models/Item';
import Evaluation from '../app/models/Evaluation';
import Category from '../app/models/Category';

const models = [
  User,
  File,
  Address,
  Phone,
  Advertisement,
  Product,
  Sale,
  Item,
  Evaluation,
  Category,
];

class DataBase {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new DataBase();
