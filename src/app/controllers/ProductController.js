import * as Yup from 'yup';
import { Op } from 'sequelize';
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

    const dados = { provider_id: req.userId, ...req.body };

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

    if (product.provider_id !== req.userId) {
      return res.status(400).json({ error: 'Operação não autorizada.' });
    }

    await product.update(req.body);

    const {
      name,
      description,
      value,
      sector,
      provider,
      image,
    } = await Product.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
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
      provider,
      image,
    });
  }

  async delete(req, res) {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(401).json({ error: 'Produto não encontrado' });
    }

    if (product.provider_id !== req.userId) {
      return res.status(400).json({ error: 'Operação não autorizada' });
    }

    await product.destroy();

    return res.send();
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const { provider_id, sector } = req.params;

    const total = await Product.count({
      where: {
        provider_id,
        sector,
      },
    });

    const products = await Product.findAll({
      where: {
        provider_id,
        sector,
      },
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          as: 'image',
          attributes: ['name', 'path', 'url'],
        },
      ],
      limit: 6,
      offset: (page - 1) * 6,
      order: [['name', 'ASC']],
    });

    return res.json({ products, total });
  }

  async show(req, res) {
    const { page = 1, name } = req.query;
    const { provider_id } = req.params;

    const total = await Product.count({
      where: {
        provider_id,
        name: { [Op.iLike]: `${name}%` },
      },
    });

    const products = await Product.findAll({
      where: {
        provider_id,
        name: { [Op.iLike]: `${name}%` },
      },
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          as: 'image',
          attributes: ['name', 'path', 'url'],
        },
      ],
      limit: 6,
      offset: (page - 1) * 6,
      order: [['name', 'ASC']],
    });

    return res.json({ products, total });
  }
}

export default new ProductController();
