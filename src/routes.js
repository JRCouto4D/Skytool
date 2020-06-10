import { Router } from 'express';
import multer from 'multer';

import FileController from './app/controllers/FileController';
import UserController from './app/controllers/UserController';

import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/', (req, res) => {
  res.json({ message: 'Hello word!!' });
});

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/users', UserController.store);

export default routes;
