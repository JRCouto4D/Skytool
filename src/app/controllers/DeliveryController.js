import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import User from '../models/User';

class DeliveryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      price: Yup.number().required(),
      mensage: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const checkUser = await User.findByPk(req.userId);

    if (!checkUser.provider) {
      return res.status(400).json({
        error:
          'É preciso ser um usuário prestador para registrar informações de entrega',
      });
    }

    const checkDelivery = await Delivery.findAll({
      where: {
        provider_id: req.userId,
      },
    });

    if (checkDelivery.length >= 1) {
      return res
        .status(401)
        .json({ error: 'Você já tem registrado seus dados de entregas' });
    }

    const data = { provider_id: req.userId, ...req.body };

    const delivery = await Delivery.create(data);

    return res.json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      price: Yup.number(),
      mensage: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const infoDelivery = await Delivery.findOne({
      where: {
        provider_id: req.userId,
      },
    });

    if (infoDelivery.length <= 0) {
      return res
        .status(400)
        .json({ error: 'Você não tem registros de informações de entrega' });
    }

    if (infoDelivery.length >= 1) {
      if (infoDelivery.provider_id !== req.userId) {
        return res.status(401).json({ error: 'Ação não autorizada' });
      }
    }

    const { price, mensage } = await infoDelivery.update(req.body);

    return res.json({
      price,
      mensage,
    });
  }
}

export default new DeliveryController();
