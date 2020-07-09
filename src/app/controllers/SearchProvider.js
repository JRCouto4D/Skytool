import { Op } from 'sequelize';
import User from '../models/User';
import File from '../models/File';

class SearchProvider {
  async show(req, res) {
    const { name, page = 1 } = req.query;

    const total = await User.count({
      where: {
        provider: true,
        name: { [Op.iLike]: `${name}%` },
      },
    });

    const providers = await User.findAll({
      where: {
        provider: true,
        name: { [Op.iLike]: `${name}%` },
      },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
      limit: 6,
      offset: (page - 1) * 6,
      order: ['name'],
      attributes: [
        'id',
        'name',
        'email',
        'sector',
        'provider',
        'open',
        'evaluation',
      ],
    });

    res.json({ providers, total });
  }
}

export default new SearchProvider();
