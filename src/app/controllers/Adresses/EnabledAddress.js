import Address from '../../models/Address';

class EnabledAddress {
  async update(req, res) {
    const { address_id } = req.params;

    const address = await Address.findByPk(address_id);

    address.enabled = true;
    const { id, street, number, city, enabled } = await address.save();

    return res.json({
      id,
      street,
      number,
      city,
      enabled,
    });
  }
}

export default new EnabledAddress();
