import Sale from '../../../models/Sale';
import Product from '../../../models/Product';
import Item from '../../../models/Item';

class RemoveItemCart {
  async delete(req, res) {
    const { item_id } = req.params;

    const item = await Item.findByPk(item_id);

    if (!item) {
      return res.status(401).json({ error: 'Item não encontrado' });
    }

    const sale = await Sale.findByPk(item.sale_id);

    if (!sale) {
      return res.status(401).json({ error: 'Venda não encontrada' });
    }

    if (sale.canceled_at !== null || sale.finished_at !== null) {
      return res
        .status(401)
        .json({ error: 'Esta venda já foi cancelada ou finalizada' });
    }

    const product = await Product.findByPk(item.product_id);

    if (!product) {
      return res.status(401).json({ error: 'Produto não encontrado' });
    }

    await sale.update({ total: sale.total - product.value * item.amount });

    await item.destroy();

    return res.send();
  }
}

export default new RemoveItemCart();
