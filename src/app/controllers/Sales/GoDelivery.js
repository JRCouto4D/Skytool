import Sale from '../../models/Sale';

class GoDelivery {
  async update(req, res) {
    const sale = await Sale.findByPk(req.params.id);

    if (!sale) {
      return res.status(401).json({ error: 'Pedido não encontrado' });
    }

    if (sale.provider_id !== req.userId) {
      return res.status(401).json({ error: 'Operação não autorizada.' });
    }

    const { id, user_id, provider_id, delivered_at } = await sale.update({
      delivered_at: new Date(),
    });

    return res.json({
      id,
      user_id,
      provider_id,
      delivered_at,
    });
  }
}

export default new GoDelivery();
