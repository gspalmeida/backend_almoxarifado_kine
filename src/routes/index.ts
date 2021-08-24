import { Router } from 'express';
import authRouter from './auth.routes';
import usersRouter from './users.routes';
import adminsRouter from './admins.routes';
import suppliersRouter from './suppliers.routes';
import costCentersRouter from './costCenters.routes';
import sellersRouter from './sellers.routes';
import isAdmin from '../middlewares/isAdmin';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const routes = Router();
routes.use('/login', authRouter);
routes.use('/users', usersRouter);
routes.use('/admins', isAdmin, adminsRouter);
routes.use('/suppliers', ensureAuthenticated, suppliersRouter);
routes.use('/suppliers', ensureAuthenticated, suppliersRouter);
routes.use('/costCenters', ensureAuthenticated, costCentersRouter);
routes.use('/sellers', ensureAuthenticated, sellersRouter);

export default routes;
