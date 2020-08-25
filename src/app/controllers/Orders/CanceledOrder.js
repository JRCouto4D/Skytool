import Sale from '../../models/Sale';
import User from '../../models/User';

class CanceledOrder {
  async update(req, res) {
    const { sale_id } = req.params;

    const sale = await Sale.findByPk(sale_id);

    const user = await User.findByPk(req.userId);

    if (!user.provider) {
      return res
        .status(401)
        .json({ error: 'Este usuário não é um prestador.' });
    }

    if (sale.provider_id !== user.id) {
      return res.status(401).json({ error: 'Operação não autorizada.' });
    }

    if (sale.canceled_at !== null || sale.finished_at !== null) {
      return res
        .status(401)
        .json({ error: 'Esta venda já foi canceleda ou finalizada' });
    }

    const { id, canceled_at, finished_at } = await sale.update({
      canceled_at: new Date(),
      finished_at: new Date(),
    });

    return res.json({
      id,
      canceled_at,
      finished_at,
    });
  }
}

export default new CanceledOrder();
