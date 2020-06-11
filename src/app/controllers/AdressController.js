import * as Yup from 'yup';
import Address from '../models/Address';
import User from '../models/User';

class AddressController {
  async store(req, res) {
    const schema = Yup.object().shape({
      street: Yup.string().required(),
      number: Yup.string().required(),
      neighborhood: Yup.string().required(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const limitAdresses = await Address.findAll({
      where: { user_id: req.userId },
    });

    if (limitAdresses.length >= 3) {
      return res
        .status(400)
        .json({ error: 'Exedido limite de registro de endereços' });
    }

    const data = { user_id: req.userId, ...req.body };

    const address = await Address.create(data);

    return res.json(address);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      street: Yup.string(),
      number: Yup.string(),
      neighborhood: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      zip_code: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const address = await Address.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!address) {
      return res.status(400).json({ error: 'Endereço não encontrado' });
    }

    if (req.userId !== address.user_id) {
      return res.status(400).json({ error: 'Operação não autorizada' });
    }

    await address.update(req.body);

    return res.json(address);
  }

  async delete(req, res) {
    const address = await Address.findByPk(req.params.id);

    if (!address) {
      return res.status(400).json({ error: 'Endereço não encontrado' });
    }

    if (address.user_id !== req.userId) {
      return res.status(400).json({ error: 'Operação não autorizada' });
    }

    await address.destroy();

    return res.send();
  }
}

export default new AddressController();
