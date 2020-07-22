import * as Yup from 'yup';
import { Op } from 'sequelize';
import Category from '../models/Category';
import File from '../models/File';
import User from '../models/User';

class CategoryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!schema.isValid(req.body)) {
      return res.status(401).json({ error: 'Dados Iválidos' });
    }

    const user = await User.findByPk(req.userId);

    if (!user.admin) {
      return res.status(401).json({ error: 'Este usuário não é um admin' });
    }

    const { name } = req.body;

    const checkCategory = await Category.findOne({
      where: {
        name,
      },
    });

    if (checkCategory) {
      return res
        .status(401)
        .json({ error: 'Esta categoria já foi cadastrada' });
    }

    const category = await Category.create(req.body);

    return res.json(category);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
    });

    if (!schema.isValid(req.body)) {
      return res.status(401).json({ error: 'Dados Iválidos' });
    }

    const user = await User.findByPk(req.userId);

    if (!user.admin) {
      return res.status(401).json({ error: 'Este usuário não é um admin' });
    }

    const { name } = req.body;

    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(401).json({ error: 'Categoria não encontrada' });
    }

    if (name && name !== category.name) {
      const checkCategory = await Category.findOne({
        where: {
          name,
        },
      });

      if (checkCategory && checkCategory.id !== category.id) {
        return res
          .status(401)
          .json({ error: 'Este nome de categoria já foi registrado' });
      }
    }

    const { id, name: categoryName, image_id } = await category.update(
      req.body
    );

    return res.json({
      id,
      categoryName,
      image_id,
    });
  }

  async delete(req, res) {
    const user = await User.findByPk(req.userId);

    if (!user.admin) {
      return res.status(401).json({ error: 'Este usuário não é um admin' });
    }

    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(401).json({ error: 'Categoria não encontrada' });
    }

    await category.destroy();

    return res.send();
  }

  async show(req, res) {
    const user = await User.findByPk(req.userId);
    const { name, page = 1 } = req.query;

    if (!user.admin) {
      return res.status(401).json({ error: 'Este usuário não é um admin' });
    }

    const total = await Category.count({
      where: {
        name: { [Op.iLike]: `${name}%` },
      },
    });

    const categories = await Category.findAll({
      where: {
        name: { [Op.iLike]: `${name}%` },
      },
      include: [
        {
          model: File,
          as: 'image',
          attributes: ['name', 'path', 'url'],
        },
      ],
      limit: 30,
      offset: (page - 1) * 30,
      order: [['name', 'ASC']],
    });

    return res.json({ categories, total });
  }
}

export default new CategoryController();
