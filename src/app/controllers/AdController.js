import * as Yup from 'yup';
import Ad from '../models/Ad';
import User from '../models/User';
import File from '../models/File';

class AdController {
  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      sector: Yup.string().required(),
      status: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Dados inválidos' });
    }

    const dados = { user_id: req.userId, ...req.body };

    const ads = await Ad.create(dados);

    return res.json(ads);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string(),
      status: Yup.string(),
      sector: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos.' });
    }

    const ad = await Ad.findByPk(req.params.id, {
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

    if (!ad) {
      return res.status(400).json({ error: 'Ads não encontrada.' });
    }

    const { id, description, sector, status, user, image } = await ad.update(
      req.body
    );

    return res.json({
      id,
      description,
      sector,
      status,
      user,
      image,
    });
  }

  async delete(req, res) {
    const ad = await Ad.findByPk(req.params.id);

    if (req.userId !== ad.user_id || !ad) {
      return res
        .status(401)
        .json({ error: 'Não foi possível finalizar a operação' });
    }

    await ad.destroy();

    return res.send();
  }

  async index(req, res) {
    const total = await Ad.count();

    const ad = await Ad.findAll({
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

    return res.json({ ad, total });
  }

  async show(req, res) {
    return res.json({ mensage: true });
  }
}

export default new AdController();
