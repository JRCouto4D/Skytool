import * as Yup from 'yup';
import Sale from '../../models/Sale';
import Address from '../../models/Address';

class CompletedSale {
  async update(req, res) {
    const schema = Yup.object().shape({
      payment: Yup.string().required(),
      change_for: Yup.number(),
      address: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const { payment, address: address_id } = req.body;

    const address = await Address.findByPk(address_id);

    if (!address) {
      return res.status(401).json({ error: 'Endereço não encontrado' });
    }

    if (address.user_id !== req.userId) {
      return res.status(401).json({ error: 'Endereço não autorizado' });
    }

    const sale = await Sale.findByPk(req.params.id);

    if (!sale) {
      return res.status(401).json({ error: 'Venda não encontrada' });
    }

    if (sale.user_id !== req.userId) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    const {
      id,
      user_id,
      provider_id,
      total,
      change_for,
      address: addRess,
    } = await sale.update(req.body);

    return res.json({
      id,
      user_id,
      provider_id,
      total,
      payment,
      change_for,
      addRess,
    });
  }
}

export default new CompletedSale();
