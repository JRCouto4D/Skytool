import jwt from 'jsonwebtoken';
import User from '../models/User';
import Address from '../models/Address';
import Phone from '../models/Phone';
import File from '../models/File';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    const address = await Address.findAll({
      where: {
        user_id: user.id,
      },
    });

    const phones = await Phone.findAll({
      where: {
        user_id: user.id,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: 'Não há registros para este usuário' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }

    const { id, name, provider, avatar } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        provider,
        avatar,
        address,
        phones,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
