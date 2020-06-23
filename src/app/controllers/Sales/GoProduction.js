import Sale from '../../models/Sale';

class GoProduction {
  async update(req, res) {
    const sale = await Sale.findByPk(req.params.id);

    if (!sale) {
      return res.status(401).json({ error: 'Pedido não encontrado' });
    }

    if (sale.provider_id !== req.userId) {
      return res.status(401).json({ error: 'Operação não autorizada.' });
    }

    const { id, user_id, provider_id, production } = await sale.update({
      production: new Date(),
    });

    return res.json({
      id,
      user_id,
      provider_id,
      production,
    });
  }
}

export default new GoProduction();
