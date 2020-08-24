import { Router } from 'express';
import multer from 'multer';

import authMiddleware from './middlewares/auth';

import FileController from './app/controllers/FileController';
import UserController from './app/controllers/UserController';
import AddressController from './app/controllers/Adresses/AdressController';
import EnabledAddress from './app/controllers/Adresses/EnabledAddress';
import DisabledAddress from './app/controllers/Adresses/DisabledAddress';
import SessionController from './app/controllers/SessionController';
import PhoneCOntroller from './app/controllers/PhoneController';
import AdvertisementController from './app/controllers/AdvertisementController';
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
import Delivery from './app/controllers/DeliveryController';
import StartOrder from './app/controllers/Orders/StartOrder';
import AddItemCart from './app/controllers/Orders/Itens/AddItemCart';
import UpdateItemCart from './app/controllers/Orders/Itens/UpdateItemCart';
import RemoveItemCart from './app/controllers/Orders/Itens/RemoveItemCart';
import CompletedOrder from './app/controllers/Orders/CompletedOrder';
import RemoveOrderPermanently from './app/controllers/Orders/RemoveOrderPermanently';

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
routes.get('/provider/category/:category_id', SearchCategory.show);
routes.get('/provider', SearchProvider.show);
routes.post('/provider/:provider_id/evaluation', Evaluation.store);
routes.put('/provider/:provider_id/evaluation', Evaluation.update);

routes.get('/adresses', AddressController.index);
routes.post('/adresses', AddressController.store);
routes.put('/adresses/:id', AddressController.update);
routes.delete('/adresses/:id', AddressController.delete);
routes.put('/address/:address_id/enabled', EnabledAddress.update);
routes.put('/address/:address_id/disabled', DisabledAddress.update);

routes.post('/phones', PhoneCOntroller.store);
routes.put('/phones/:id', PhoneCOntroller.update);
routes.delete('/phones/:id', PhoneCOntroller.delete);
routes.get('/phones', PhoneCOntroller.index);

routes.post('/adverts', AdvertisementController.store);
routes.put('/adverts/:id', AdvertisementController.update);
routes.delete('/adverts/:id', AdvertisementController.delete);
routes.get('/adverts', AdvertisementController.index);
routes.get('/adverts/:id', AdvertisementController.show);

routes.post('/products', ProductController.store);
routes.put('/products/:id', ProductController.update);
routes.delete('/products/:id', ProductController.delete);
routes.get('/products/provider/:provider_id/', ProductController.show);
routes.get(
  '/products/provider/:provider_id/category/:sector',
  ProductController.index
);

routes.get('/sales', SaleController.index);
routes.post('/sales/:provider_id', SaleController.store);
routes.put('/sales/:id', SaleController.update);
routes.delete('/sales/:id', SaleController.delete);
routes.put('/sale/:id/goproduction', GoProduction.update);
routes.put('/sale/:id/godelivery', GoDelivery.update);
routes.put('/sale/:id/completed', CompletedSale.update);
routes.put('/sale/:id/canceled', CanceledSale.update);
routes.put('/sale/:id/finished', FinishedSale.update);

routes.post('/categories', Category.store);
routes.put('/categories/:id', Category.update);
routes.delete('/categories/:id', Category.delete);
routes.get('/categories', Category.show);

routes.post('/addItem', AddItem.store);
routes.put('/addItem/:id', AddItem.update);
routes.get('/addItem', AddItem.index);

routes.delete('/removeItem/:id', RemoveItem.delete);

routes.post('/infoDelivery', Delivery.store);
routes.put('/infoDelivery', Delivery.update);
routes.get('/infoDelivery/:provider_id', Delivery.index);

routes.post('/provider/:provider_id/order/start', StartOrder.store);
routes.put('/order/:sale_id/completed', CompletedOrder.update);
routes.delete(
  '/order/:sale_id/remove/permanently',
  RemoveOrderPermanently.delete
);
routes.post('/order/:sale_id/addItem/:product_id', AddItemCart.store);
routes.put('/item/:item_id/update', UpdateItemCart.update);
routes.delete('/item/:item_id/remove', RemoveItemCart.delete);

export default routes;
