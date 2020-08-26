import Sale from '../../models/Sale';
import User from '../../models/User';
import File from '../../models/File';

class ListOrders {
  async index(req, res) {
    const orders = await Sale.findAll({
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(orders);
  }

  async show(req, res) {
    const { provider_id } = req.params;
    const orders = await Sale.findAll({
      where: {
        provider_id,
        completed_at: null,
      },
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(orders);
  }
}

export default new ListOrders();
