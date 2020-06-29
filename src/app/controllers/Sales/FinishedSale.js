import Sale from '../../models/Sale';
import User from '../../models/User';

class Finished {
  async update(req, res) {
    const sale = await Sale.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!sale) {
      return res.status(401).json({ error: 'Venda não encontrada' });
    }

    const user = await User.findByPk(req.userId);

    if (sale.provider_id === user.id) {
      if (sale.production === null) {
        return res
          .status(401)
          .json({ error: 'Venda ainda não foi para produção' });
      }

      if (sale.delivered === null) {
        return res
          .status(401)
          .json({ error: 'Esta venda ainda não saiu para entrega' });
      }

      if (sale.canceled_at !== null) {
        return res.status(401).json({ error: 'Esta venda foi cancelada' });
      }

      if (sale.finished !== null) {
        return res.status(401).json({ error: 'Esta venda já foi finalizada' });
      }
    } else {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    const {
      id,
      total,
      payment,
      change_to,
      completed_at,
      finished,
    } = await sale.update({ finished: new Date() });

    return res.json({
      id,
      user: sale.user,
      provider: sale.provider,
      total,
      payment,
      change_to,
      completed_at,
      finished,
    });
  }
}

export default new Finished();
