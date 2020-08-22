import * as Yup from 'yup';
import Sale from '../../../models/Sale';
import Product from '../../../models/Product';
import Item from '../../../models/Item';

class UpdateItemCart {
  async update(req, res) {
    const schema = Yup.object().shape({
      amount: Yup.number(),
      comments: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos.' });
    }

    const { amount } = req.body;

    const item = await Item.findByPk(req.params.item_id);

    if (!item) {
      return res.status(401).json({ error: 'Item não encontrado' });
    }

    const sale = await Sale.findByPk(item.sale_id);

    if (!sale) {
      return res.status(401).json({ error: 'Venda não encontrada' });
    }

    const product = await Product.findByPk(item.product_id);

    if (!product) {
      return res.status(401).json({ error: 'Produto não encontrado' });
    }

    if (amount) {
      const lowItem = sale.total - product.value * item.amount;
      const newItem = lowItem + product.value * amount;

      await sale.update({ total: newItem });
    }

    const updatedItem = await item.update(req.body);

    return res.json(updatedItem);
  }
}

export default new UpdateItemCart();
