/* eslint-disable camelcase */
import { Router } from 'express';
import multer from 'multer';
import { getRepository } from 'typeorm';
import uploadConfig from '../config/upload';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import User from '../models/User';

import CreateUserService from '../services/CreateUserService';

interface UserWithoutPassword {
  name: string;
  email: string;
  walletBalance: string;
  password?: string;
}

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', upload.single('avatar'), async (request, response) => {
  let avatar = '';
  const { name, email, password, walletBalance } = request.body;
  if (request.file) {
    avatar = request.file.filename;
  }

  const createUser = new CreateUserService();

  const user: UserWithoutPassword = await createUser.execute({
    name,
    email,
    password,
    walletBalance,
    avatar,
  });

  delete user.password;

  return response.json(user);
});

usersRouter.get('/saldo', ensureAuthenticated, async (request, response) => {
  const financialMovementCategoryRepository = getRepository(User);

  const userData = await financialMovementCategoryRepository.findOneOrFail({
    where: { id: request.user.id },
  });

  const { walletBalance } = userData;
  return response.json(walletBalance);
});
export default usersRouter;
