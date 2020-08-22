import Sale from '../../models/Sale';
import User from '../../models/User';

class StartOrder {
  async store(req, res) {
    const { provider_id } = req.params;

    if (Number(provider_id) === req.userId) {
      return res.status(400).json({ error: 'Operação não autorizada.' });
    }

    const provider = await User.findByPk(provider_id);

    if (!provider) {
      return res.status(401).json({ error: 'Prestador não encontrado' });
    }

    if (!provider.provider) {
      return res
        .status(400)
        .json({ error: 'Apenas prestadores de serviço podem realizar vendas' });
    }

    if (!provider.open) {
      return res.status(401).json({ error: 'Este prestador está fechado' });
    }

    const checkSale = await Sale.findAll({
      where: {
        provider_id,
        finished_at: null,
      },
    });

    if (checkSale.length >= 1) {
      return res
        .status(400)
        .json({ error: 'Existe uma venda não finalizada com este vendedor' });
    }

    const sale = await Sale.create({
      user_id: req.userId,
      provider_id,
      payment: 'DINHEIRO',
    });

    return res.json(sale);
  }
}

export default new StartOrder();
