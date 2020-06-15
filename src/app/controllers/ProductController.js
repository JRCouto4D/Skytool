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
    const schema = Yup.object().shape({
      name: Yup.string(),
      description: Yup.string(),
      value: Yup.number(),
      sector: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const product = await Product.findByPk(req.params.id);

    if (product.user_id !== req.userId) {
      return res.status(400).json({ error: 'Operação não autorizada.' });
    }

    await product.update(req.body);

    const {
      name,
      description,
      value,
      sector,
      user,
      image,
    } = await Product.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
        {
          model: File,
          as: 'image',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json({
      name,
      description,
      value,
      sector,
      user,
      image,
    });
  }

  async delete(req, res) {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(401).json({ error: 'Produto não encontrado' });
    }

    if (product.user_id !== req.userId) {
      return res.status(400).json({ error: 'Operação não autorizada' });
    }

    await product.destroy();

    return res.send();
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const total = await Product.count();

    const products = await Product.findAll({
      limit: 5,
      offset: (page - 1) * 5,
      order: ['name'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
        {
          model: File,
          as: 'image',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json({ products, total });
  }

  async show(req, res) {
    return res.json({ mensage: true });
  }
}

export default new ProductController();
