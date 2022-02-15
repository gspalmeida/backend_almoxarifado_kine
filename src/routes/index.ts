import { Router } from 'express';
import authRouter from './auth.routes';
import usersRouter from './users.routes';
import adminsRouter from './admins.routes';
import suppliersRouter from './suppliers.routes';
import costCentersRouter from './costCenters.routes';
import sellersRouter from './sellers.routes';
import techniciansRouter from './technicians.routes';
import clientsRouter from './clients.routes';
import measureUnitsRouter from './measureUnits.routes';
import productsRouter from './products.routes';
import serviceOrdersRouter from './serviceOrders.routes';
import addMaterialRouter from './addMaterial.routes';
import isAdmin from '../middlewares/isAdmin';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const routes = Router();
routes.use('/login', authRouter);
routes.use('/users', usersRouter); // Rota Criação de Usuários
routes.use('/admins', isAdmin, adminsRouter); // Rota Gestão de Usuários
routes.use('/suppliers', ensureAuthenticated, suppliersRouter);
routes.use('/costCenters', ensureAuthenticated, costCentersRouter);
routes.use('/sellers', ensureAuthenticated, sellersRouter);
routes.use('/technicians', ensureAuthenticated, techniciansRouter);
routes.use('/clients', ensureAuthenticated, clientsRouter);
routes.use('/measureUnits', ensureAuthenticated, measureUnitsRouter);
routes.use('/products', ensureAuthenticated, productsRouter);
//TODO /addMaterial é uma rota "filha" de serviceOrders, unificar elas
routes.use('/serviceOrders', ensureAuthenticated, serviceOrdersRouter);
routes.use('/addMaterial', ensureAuthenticated, addMaterialRouter);

export default routes;
