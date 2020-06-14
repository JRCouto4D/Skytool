import * as Yup from 'yup';
import Product from '../models/Product';
import User from '../models/User';
import File from '../models/File';

class ProductController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string(),
      value: Yup.number().required(),
      sector: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const user = await User.findByPk(req.userId);

    if (!user.provider) {
      return res.status(400).json({ error: 'O usuário deve ser um prestador' });
    }

    const dados = { user_id: req.userId, ...req.body };

    const product = await Product.create(dados);

    return res.json(product);
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
