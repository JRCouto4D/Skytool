import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import User from '../app/models/User';
import File from '../app/models/File';
import Address from '../app/models/Address';
import Phone from '../app/models/Phone';
import Ad from '../app/models/Ad';
import Product from '../app/models/Product';
import Sales from '../app/models/Sales';

const models = [User, File, Address, Phone, Ad, Product, Sales];

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
