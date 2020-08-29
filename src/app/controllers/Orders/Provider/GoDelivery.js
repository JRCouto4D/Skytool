import User from '../../../models/User';
import Sale from '../../../models/Sale';

class GoDelivery {
  async update(req, res) {
    const user = await User.findByPk(req.userId);
    if (!user.provider) {
      return res.status(400).json({ error: 'Este usuário não é um prestador' });
    }

    const { sale_id } = req.params;
    const sale = await Sale.findByPk(sale_id);

    if (!sale) {
      return res.status(401).json({ error: 'A venda não foi encontrada' });
    }

    if (sale.provider_id !== req.userId) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    if (
      sale.canceled_at !== null ||
      sale.finished_at !== null ||
      sale.completed_at === null
    ) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    sale.delivered_at = new Date();
    const newSale = await sale.save();

    return res.json(newSale);
  }
}

export default new GoDelivery();
