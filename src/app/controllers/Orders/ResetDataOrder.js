import Item from '../../models/Item';
import Sale from '../../models/Sale';

class ResetDataOrder {
  async delete(req, res) {
    const sale = await Sale.findAll({
      where: {
        user_id: req.userId,
        completed_at: null,
        finished_at: null,
      },
    });

    sale.map(async (s) => {
      await Item.destroy({
        where: {
          sale_id: s.id,
        },
      });
      await Sale.destroy({
        where: {
          id: s.id,
        },
      });
    });

    return res.send();
  }
}

export default new ResetDataOrder();
