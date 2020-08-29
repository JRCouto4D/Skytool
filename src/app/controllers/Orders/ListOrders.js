import Sale from '../../models/Sale';
import User from '../../models/User';
import File from '../../models/File';
import Category from '../../models/Category';

class ListOrders {
  async index(req, res) {
    const total = await Sale.count();
    const orders = await Sale.findAll({
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
            {
              model: Category,
              as: 'category',
              attributes: ['name'],
            },
          ],
        },
      ],
      order: [['completed_at', 'DESC']],
    });

    return res.json({ orders, total });
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
