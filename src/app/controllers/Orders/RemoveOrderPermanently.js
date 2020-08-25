import Item from '../../models/Item';
import Sale from '../../models/Sale';

class RemoveOrderPermanently {
  async delete(req, res) {
    const { sale_id } = req.params;

    const sale = await Sale.findByPk(sale_id);

    if (!sale) {
      return res.status(400).json({ error: 'Venda não encontrada.' });
    }

    if (
      sale.completed_at !== null ||
      sale.finished_at !== null ||
      sale.canceled_at !== null
    ) {
      return res.status(401).json({ error: 'Operação não autorizada.' });
    }

    await Item.destroy({
      where: {
        sale_id,
      },
    });

    await sale.destroy();

    return res.send();
  }
}

export default new RemoveOrderPermanently();
