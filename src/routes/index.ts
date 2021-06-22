import { Router } from 'express';
import authRouter from './auth.routes';
import usersRouter from './users.routes';
import adminsRouter from './admins.routes';
import isAdmin from '../middlewares/isAdmin';
import movementsRouter from './movements.routes';
import movementCategoriesRouter from './movementCategories.routes';

const routes = Router();
routes.use('/auth', authRouter);
routes.use('/users', usersRouter);
routes.use('/admins', isAdmin, adminsRouter);
routes.use('/movements', movementsRouter);
routes.use('/categories', movementCategoriesRouter);

export default routes;
