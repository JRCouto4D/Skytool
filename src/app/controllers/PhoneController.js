import * as Yup from 'yup';
import Phone from '../models/Phone';
import User from '../models/User';

class PhoneController {
  async store(req, res) {
    const schema = Yup.object().shape({
      number: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos.' });
    }

    const dados = { id: req.userId, ...req.body };

    const phone = await Phone.create(dados);

    return res.json(phone);
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
