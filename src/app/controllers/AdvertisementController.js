import * as Yup from 'yup';
import Advertisement from '../models/Advertisement';
import User from '../models/User';
import File from '../models/File';

class AdvertisementController {
  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      sector: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Dados inválidos' });
    }

    const dados = { user_id: req.userId, ...req.body };

    const ads = await Advertisement.create(dados);

    return res.json(ads);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string(),
      sector: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos.' });
    }

    const advertisement = await Advertisement.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          as: 'image',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (!advertisement) {
      return res.status(400).json({ error: 'Ads não encontrada.' });
    }

    const {
      id,
      description,
      sector,
      active,
      user,
      image,
    } = await advertisement.update(req.body);

    return res.json({
      id,
      description,
      sector,
      active,
      user,
      image,
    });
  }

  async delete(req, res) {
    const advertisement = await Advertisement.findByPk(req.params.id);

    if (req.userId !== advertisement.user_id || !advertisement) {
      return res
        .status(401)
        .json({ error: 'Não foi possível finalizar a operação' });
    }

    await advertisement.destroy();

    return res.send();
  }

  async index(req, res) {
    const total = await Advertisement.count();

    const advertisement = await Advertisement.findAll({
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

    return res.json({ advertisement, total });
  }

  async show(req, res) {
    const total = await Advertisement.count({
      where: {
        user_id: req.userId,
        active: true,
      },
    });

    const adverts = await Advertisement.findAll({
      where: {
        user_id: req.userId,
        active: true,
      },
      include: [
        {
          model: User,
          as: 'users',
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

    return res.json({ adverts, total });
  }
}

export default new AdvertisementController();
