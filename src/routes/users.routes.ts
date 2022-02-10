/* eslint-disable camelcase */
import { Router } from 'express';
import multer from 'multer';
import { getRepository } from 'typeorm';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import User from '../models/User';

import CreateUserService from '../services/CreateUserService';
interface UserWithoutPassword {
  name: string;
  email: string;
  password?: string;
}

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', upload.single('avatar'), async (request, response) => {
  let avatar = '';
  const { name, email, password } = request.body;
  if (request.file) {
    avatar = request.file.filename;
  }

  const createUser = new CreateUserService();

  const user: UserWithoutPassword = await createUser.execute({
    name,
    email,
    password,
    avatar,
  });

  delete user.password;

  return response.json(user);
});
// FIXME Essa rota deveria mesmo existir ou somente admins podem acessar esse conteúdo?
usersRouter.get('/', ensureAuthenticated, async (request, response) => {
  console.log('\n\n\n\n Entrou no get Users');
  const usersRouterRepository = getRepository(User);
  try {
    const users = await usersRouterRepository.find();
    console.log(users);

    return response.json(users);
  } catch (error) {
    throw new AppError('Nenhum Usuário encontrado', 500);
  }
});

export default usersRouter;
