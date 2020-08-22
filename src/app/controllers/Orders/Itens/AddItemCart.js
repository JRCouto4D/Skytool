import * as Yup from 'yup';
import Product from '../../../models/Product';
import Sale from '../../../models/Sale';
import Item from '../../../models/Item';
import Delivery from '../../../models/Delivery';

class AddItemCart {
  async store(req, res) {
    const schema = Yup.object().shape({
      amount: Yup.number().required(),
      comments: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const { sale_id, product_id } = req.params;
    const { amount, comments } = req.body;

    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(401).json({ error: 'Produtor não encontrado' });
    }

    const sale = await Sale.findByPk(sale_id);

    if (!sale) {
      return res.status(401).json({ error: 'Venda não encontrada' });
    }

    if (sale.canceled_at !== null || sale.finished_at !== null) {
      return res
        .status(401)
        .json({ error: 'Esta venda já foi cancelada ou finalizada' });
    }

    if (product.provider_id !== sale.provider_id) {
      return res.status(401).json({
        error:
          'Ação não autorizada. Este produto não está vinculado ao prestador',
      });
    }

    const infoDelivery = await Delivery.findOne({
      where: {
        provider_id: sale.provider_id,
      },
    });

    const totalItem =
      sale.total === null
        ? product.value * amount + infoDelivery.price
        : sale.total + product.value * amount;

    await sale.update({ total: totalItem });

    const item = await Item.create({
      product_id,
      sale_id,
      amount,
      comments,
    });

    return res.json(item);
  }
}

export default new AddItemCart();
