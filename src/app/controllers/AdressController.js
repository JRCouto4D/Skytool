import Address from '../models/Address';
import User from '../models/User';

class AddressController {
  async store(req, res) {
    return res.json({ mensage: true });
  }
}

export default new AddressController();
