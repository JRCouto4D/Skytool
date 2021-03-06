import User from '../models/User';

class CloseProvider {
  async update(req, res) {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (!user.provider) {
      return res.status(401).json({ error: 'Este usuário não é um provider' });
    }

    if (!user.open) {
      return res.status(401).json({ error: 'Este provedor já está fechado' });
    }

    const { id, name, email, open } = await user.update({
      open: false,
    });

    return res.json({
      id,
      name,
      email,
      open,
    });
  }
}

export default new CloseProvider();
