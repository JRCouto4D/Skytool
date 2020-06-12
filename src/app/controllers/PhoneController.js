import Phone from '../models/Phone';
import User from '../models/User';

class PhoneController {
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

export default new PhoneController();
