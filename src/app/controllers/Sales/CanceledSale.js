import Sale from '../../models/Sale';
import User from '../../models/User';

class CanceledSale {
  async update(req, res) {
    const sale = await Sale.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'provider'],
        },
      ],
    });

    if (!sale) {
      return res.status(401).json({ error: 'Venda não encontrada' });
    }

    if (sale.canceled_at !== null || sale.finished_at !== null) {
      return res
        .status(401)
        .json({ error: 'Esta venda já foi cancelada ou finalizada' });
    }

    const user = await User.findByPk(req.userId);

    if (user.provider) {
      if (sale.provider_id !== user.id) {
        return res.status(401).json({ error: 'Operação não autorizada' });
      }

      if (sale.delivered_at !== null) {
        return res
          .status(401)
          .json({ error: 'Encomenda já saiu para entrega' });
      }
    } else if (sale.completed_at !== null) {
      return res
        .status(401)
        .json({ error: 'Você não pode cancelar esta venda' });
    }

    const {
      id,
      user_id,
      provider_id,
      total,
      canceled_at,
      finished_at,
    } = await sale.update({
      canceled_at: new Date(),
      finished_at: new Date(),
    });

    return res.json({
      id,
      user_id,
      provider_id,
      total,
      canceled_at,
      finished_at,
    });
  }
}

export default new CanceledSale();
