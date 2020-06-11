import { Router } from 'express';
import multer from 'multer';

import FileController from './app/controllers/FileController';
import UserController from './app/controllers/UserController';
import AddressController from './app/controllers/AdressController';

import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/', (req, res) => {
  res.json({ message: 'Hello word!!' });
});

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/users', UserController.store);

routes.post('/adresses', AddressController.store);
routes.put('/addresses/:id', AddressController.update);
routes.delete('/addresses/:id', AddressController.delete);

export default routes;
