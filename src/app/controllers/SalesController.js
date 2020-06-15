import * as Yup from 'yup';
import Sales from '../models/Sales';
import User from '../models/User';

class SalesController {
  async store(req, res) {
    return res.json({ mensage: true });
  }

  async update(req, res) {
    return res.json({ mensage: true });
  }

  async delete(req, res) {
    return res.json({ mensage: true });
  }

  async show(req, res) {
    return res.json({ mensage: true });
  }
}

export default new SalesController();
