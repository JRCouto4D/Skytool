import * as Yup from 'yup';
import User from '../models/User';
import Category from '../models/Category';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      category_id: Yup.number(),
      provider: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação de dados' });
    }

    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (userExist) {
      return res.status(400).json({ error: 'Usuário já cadastrado' });
    }

    if (req.body.category_id) {
      const checkCategory = await Category.findByPk(req.body.category_id);

      if (!checkCategory) {
        return res
          .status(401)
          .json({ error: 'Esta categoria não está registrada' });
      }
    }

    if (req.body.provider) {
      if (req.userId) {
        const checkUser = await User.findByPk(req.userId);

        if (checkUser && checkUser.admin) {
          return res.status(401).json({
            error: 'Você não está logado ou não é um admin do Skytool.',
          });
        }
      }
    }

    const { id, name, email, provider, category_id } = await User.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      provider,
      category_id,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados Iválidos' });
    }

    const { email, oldPassword, password } = req.body;

    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const checkEmail = await User.findOne({
        where: {
          email,
        },
      });

      if (checkEmail) {
        return res.status(400).json({ error: 'Esse email já está em uso.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senhas não conferem.' });
    }

    if (password && !oldPassword) {
      return res.status(401).json({ error: 'Informe sua senha atual' });
    }

    const { category_id } = req.body;

    if (category_id && category_id !== user.category_id) {
      const checkCategory = await Category.findByPk(category_id);

      if (!checkCategory) {
        return res
          .status(401)
          .json({ error: 'Esta categoria não está registrada' });
      }
    }

    const { id, name, category_id: category } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      category,
    });
  }

  async delete(req, res) {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }

    await user.destroy();

    return res.send();
  }

  async index(req, res) {
    return res.json({ mensage: true });
  }

  async show(req, res) {
    return res.json({ mensage: true });
  }
}

export default new UserController();
