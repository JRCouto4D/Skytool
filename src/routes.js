import { Router } from 'express';
import multer from 'multer';

import authMiddleware from './middlewares/auth';

import FileController from './app/controllers/FileController';
import UserController from './app/controllers/UserController';
import AddressController from './app/controllers/AdressController';
import SessionController from './app/controllers/SessionController';
import PhoneCOntroller from './app/controllers/PhoneController';
import AdController from './app/controllers/AdController';
import ProductController from './app/controllers/ProductController';
import SaleController from './app/controllers/SaleController';
import AddItem from './app/controllers/itensSale/AddItem';
import RemoveItem from './app/controllers/itensSale/RemoveItem';
import CompletedSale from './app/controllers/Sales/CompletedSale';
import GoProduction from './app/controllers/Sales/GoProduction';
import GoDelivery from './app/controllers/Sales/GoDelivery';
import CanceledSale from './app/controllers/Sales/CanceledSale';
import FinishedSale from './app/controllers/Sales/FinishedSale';
import OpenProvider from './app/controllers/OpenProvider';
import CloseProvider from './app/controllers/CloseProvider';
import ProviderController from './app/controllers/Admin/ProviderController';
import SearchCategory from './app/controllers/SearchProviderSector';
import SearchProvider from './app/controllers/SearchProvider';
import Evaluation from './app/controllers/EvaluationController';
import Category from './app/controllers/CategoryController';

import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/', (req, res) => {
  res.json({ message: 'Hello word!!' });
});

routes.post('/session', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/provider', ProviderController.store);

routes.put('/users', UserController.update);
routes.delete('/users/:id', UserController.delete);
routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);

routes.put('/provider/open', OpenProvider.update);
routes.put('/provider/close', CloseProvider.update);
routes.get('/provider/category/:sector', SearchCategory.show);
routes.get('/provider', SearchProvider.show);
routes.post('/provider/:provider_id/evaluation', Evaluation.store);
routes.put('/provider/:provider_id/evaluation', Evaluation.update);

routes.post('/adresses', AddressController.store);
routes.put('/adresses/:id', AddressController.update);
routes.delete('/adresses/:id', AddressController.delete);

routes.post('/phones', PhoneCOntroller.store);
routes.put('/phones/:id', PhoneCOntroller.update);
routes.delete('/phones/:id', PhoneCOntroller.delete);
routes.get('/phones', PhoneCOntroller.index);

routes.post('/ads', AdController.store);
routes.put('/ads/:id', AdController.update);
routes.delete('/ads/:id', AdController.delete);
routes.get('/ads', AdController.index);
routes.get('/ads/:id', AdController.show);

routes.post('/products', ProductController.store);
routes.put('/products/:id', ProductController.update);
routes.delete('/products/:id', ProductController.delete);
routes.get('/products/provider/:user_id/', ProductController.show);
routes.get(
  '/products/provider/:user_id/category/:sector',
  ProductController.index
);

routes.get('/sales', SaleController.show);
routes.post('/sales', SaleController.store);
routes.put('/sales/:id', SaleController.update);
routes.delete('/sales/:id', SaleController.delete);

routes.post('/categories', Category.store);
routes.put('/categories/:id', Category.update);

routes.post('/addItem', AddItem.store);
routes.put('/addItem/:id', AddItem.update);

routes.delete('/removeItem/:id', RemoveItem.delete);

routes.put('/completed/sale/:id', CompletedSale.update);

routes.put('/goproduction/:id', GoProduction.update);

routes.put('/godelivery/:id', GoDelivery.update);

routes.put('/canceled/sale/:id', CanceledSale.update);

routes.put('/finished/sale/:id', FinishedSale.update);

export default routes;
