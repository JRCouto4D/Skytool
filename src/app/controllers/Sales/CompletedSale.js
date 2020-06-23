import * as Yup from 'yup';
import Sale from '../../models/Sale';
import Address from '../../models/Address';

class CompletedSale {
  async update(req, res) {
    const schema = Yup.object().shape({
      payment: Yup.string().required(),
      change_for: Yup.string(),
      address_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Dados inválidos' });
    }

    const sale = await Sale.findByPk(req.params.id);

    if (!sale) {
      return res.status(401).json({ error: 'Venda não encontrada' });
    }

    if (sale.user_id !== req.userId) {
      return res.status(401).json({ error: 'Venda não autorizada' });
    }

    if (sale.completed_at !== null) {
      return res.status(401).json({ error: 'Este pedido já foi completo' });
    }

    const { address_id } = req.body;

    const address = await Address.findByPk(address_id);

    if (!address) {
      return res.status(401).json({ error: 'Endereço não encontrado' });
    }

    if (address.user_id !== req.userId) {
      return res.status(401).json({ error: 'Endereço não encotrado' });
    }

    const data = { ...req.body, completed_at: new Date() };

    const {
      id,
      user_id,
      provider_id,
      payment,
      change_for,
      completed_id,
    } = await sale.update(data);

    return res.json({
      id,
      user_id,
      provider_id,
      payment,
      change_for,
      address_id,
      completed_id,
    });
  }
}

export default new CompletedSale();
