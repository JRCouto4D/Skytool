import * as Yup from 'yup';
import User from '../../models/User';

class ProviderController {
  async store(req, res) {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(401).json({ error: 'Admin não encontrado' });
    }

    if (!user.admin) {
      return res.status(401).json({ error: 'Este usuário não é um admin' });
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      sector: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação de dados' });
    }

    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (userExist) {
      return res.status(400).json({ error: 'Prestador já cadastrado' });
    }

    const dados = {
      ...req.body,
      provider: true,
    };

    const { id, name, email, provider, sector } = await User.create(dados);

    return res.json({
      id,
      name,
      email,
      provider,
      sector,
    });
  }

  async delete(req, res) {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(401).json({ error: 'Admin não encontrado' });
    }

    if (!user.admin) {
      return res.status(401).json({ error: 'Este usuário não é um admin' });
    }

    const provider = await User.findByPk(req.params.id);

    if (!provider) {
      return res.status(401).json({ error: 'Prestador não encontrado' });
    }

    await provider.destroy();

    return res.send();
  }
}

export default new ProviderController();
