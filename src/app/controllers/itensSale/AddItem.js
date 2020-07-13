import * as Yup from 'yup';
import Product from '../../models/Product';
import Sale from '../../models/Sale';
import Item from '../../models/Item';

class AddItem {
  async store(req, res) {
    const schema = Yup.object().shape({
      product_id: Yup.number().required(),
      sale_id: Yup.number().required(),
      amount: Yup.number().required(),
      comments: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const { product_id, sale_id, amount } = req.body;

    const checkProduct = await Product.findByPk(product_id);

    if (!checkProduct) {
      return res.status(401).json({ error: 'Produtor não encontrado' });
    }

    const checkSale = await Sale.findByPk(sale_id);

    if (!checkSale) {
      return res.status(401).json({ error: 'Venda não encontrada' });
    }

    if (checkSale.canceled_at !== null || checkSale.finished !== null) {
      return res
        .status(401)
        .json({ error: 'Esta venda já foi cancelada ou finalizada' });
    }

    if (checkProduct.user_id !== checkSale.provider_id) {
      return res.status(401).json({
        error:
          'Ação não autorizada. Este produto não está vinculado ao prestador',
      });
    }

    const totalItem =
      checkSale.total === null
        ? checkProduct.value * amount
        : checkSale.total + checkProduct.value * amount;

    await checkSale.update({ total: totalItem });

    const item = await Item.create(req.body);

    return res.json(item);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      amount: Yup.number(),
      comments: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos.' });
    }

    const { amount } = req.body;

    const item = await Item.findByPk(req.params.id);

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
      await sale.update({ total: sale.total - product.value * item.amount });

      const totalItem = sale.total + product.value * amount;

      await sale.update({ total: totalItem });
    }

    await item.update(req.body);

    return res.json(item);
  }
}

export default new AddItem();
