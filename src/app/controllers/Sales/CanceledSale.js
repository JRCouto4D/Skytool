import Sale from '../../models/Sale';

class CanceledSale {
  async update(req, res) {
    const sale = await Sale.findByPk(req.params.id);

    if (!sale) {
      return res.status(401).json({ error: 'Venda não encontrada' });
    }

    if (sale.provider_id !== req.userId) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    if (sale.delivered !== null) {
      return res.status(401).json({ error: 'Encomenda já saiu para entrega' });
    }

    const { id, user_id, provider_id, total, canceled_at } = await sale.update({
      canceled_at: new Date(),
    });

    return res.json({
      id,
      user_id,
      provider_id,
      total,
      canceled_at,
    });
  }
}

export default new CanceledSale();
