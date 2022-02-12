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

usersRouter.get('/profile', ensureAuthenticated, async (request, response) => {
  const usersRouterRepository = getRepository(User);
  try {
    const user = await usersRouterRepository.findOne(request.user.id);
    return response.json(user);
  } catch (error) {
    throw new AppError('Falha ao buscar perfil', 500);
  }
});

usersRouter.patch(
  '/avatar',
  upload.single('avatar'),
  ensureAuthenticated,
  async (request, response) => {
    if (!request.file) {
      throw new AppError('Nenhuma imagem encontrada', 500);
    }
    const avatar = request.file.filename;
    const usersRouterRepository = getRepository(User);
    try {
      await usersRouterRepository.update(request.user.id, {
        avatar,
      });
      const user = await usersRouterRepository.findOne(request.user.id);
      return response.json(user);
    } catch (error) {
      throw new AppError('Nenhum Usuário encontrado', 500);
    }
  },
);

export default usersRouter;
