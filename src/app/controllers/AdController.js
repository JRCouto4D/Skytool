import * as Yup from 'yup';
import Ad from '../models/Ad';
import User from '../models/User';
import File from '../models/File';

class AdController {
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

export default new AdController();
