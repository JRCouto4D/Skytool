import Product from '../models/Product';
import User from '../models/User';
import File from '../models/File';

class ProductController {
  async store(req, res) {
    return res.json({ mensage: true });
  }

  async update(req, res) {
    return res.json({ mensage: true });
  }

  async delete(req, res) {
    return res.json({ mensage: true });
  }

  async index(req, res) {
    return res.json({ mensage: true });
  }

  async show(req, res) {
    return res.json({ mensage: true });
  }
}

export default new ProductController();
