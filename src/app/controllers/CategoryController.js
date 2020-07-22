import * as Yup from 'yup';
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

    const checkCategory = await Category.findAll({
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
}

export default new CategoryController();
