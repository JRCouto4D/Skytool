import * as Yup from 'yup';
import Sale from '../../models/Sale';
import Address from '../../models/Address';

class CompletedOrder {
  async update(req, res) {
    const schema = Yup.object().shape({
      payment: Yup.string().required(),
      change_for: Yup.string(),
      address_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos ' });
    }

    const { sale_id } = req.params;
    const { payment, change_for, address_id } = req.body;

    const address = await Address.findByPk(address_id);

    if (!address) {
      return res.status(401).json({ error: 'Endereço não encontrado.' });
    }

    if (address.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'O endereço não está vinculado a este usuário.' });
    }

    const data = {
      payment,
      change_for,
      address_id,
      completed_at: new Date(),
    };

    const sale = await Sale.findByPk(sale_id);

    if (!sale) {
      return res.status(401).json({ error: 'Venda não encontrada.' });
    }

    if (
      sale.completed_at !== null ||
      sale.finished_at !== null ||
      sale.user_id !== req.userId
    ) {
      return res.status(401).json({ error: 'Ação não autorizada.' });
    }

    const completeSale = await sale.update(data);

    return res.json(completeSale);
  }
}

export default new CompletedOrder();
