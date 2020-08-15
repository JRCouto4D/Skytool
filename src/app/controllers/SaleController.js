import Sales from '../models/Sale';
import User from '../models/User';

class SalesController {
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

    const checkSale = await Sales.findAll({
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

    const sale = await Sales.create({
      user_id: req.userId,
      provider_id,
      payment: 'A VISTA',
    });

    return res.json(sale);
  }

  async update(req, res) {
    return res.json({ mensage: true });
  }

  async delete(req, res) {
    const sale = await Sales.findByPk(req.params.id);

    if (!sale) {
      return res.status(400).json({ error: 'Venda não encontrada' });
    }

    await sale.destroy();

    return res.send();
  }

  async index(req, res) {
    const sales = await Sales.findAll();

    return res.json(sales);
  }
}

export default new SalesController();
