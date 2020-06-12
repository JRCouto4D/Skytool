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

    const limitPhones = await Phone.findAll({
      where: {
        user_id: req.userId,
      },
    });

    if (limitPhones.length >= 3) {
      return res
        .status(400)
        .json({ error: 'Exedido numero de telefones permitido por usuário' });
    }

    const dados = { user_id: req.userId, ...req.body };

    const phone = await Phone.create(dados);

    return res.json(phone);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      number: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const phone = await Phone.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    const { id, number, user } = await phone.update(req.body);

    return res.json({
      id,
      number,
      user,
    });
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
