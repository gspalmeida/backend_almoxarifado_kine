/* eslint-disable camelcase */
import { Router } from 'express';
import multer from 'multer';
import { getRepository } from 'typeorm';
import uploadConfig from '../config/upload';

import User from '../models/User';
import Admin from '../models/Admin';

import CreateAdminService from '../services/CreateAdminService';
import AppError from '../errors/AppError';

interface AdminWithoutPassword {
  name: string;
  email: string;
  password?: string;
}

const adminsRouter = Router();
const upload = multer(uploadConfig);

adminsRouter.post('/', upload.single('avatar'), async (request, response) => {
  let avatar = '';
  const { name, email, password } = request.body;
  if (request.file) {
    avatar = request.file.filename;
  }

  const createAdmin = new CreateAdminService();

  const admin: AdminWithoutPassword = await createAdmin.execute({
    name,
    email,
    password,
    avatar,
  });

  delete admin.password;

  return response.json(admin);
});

adminsRouter.patch(
  '/avatar',
  upload.single('avatar'),
  async (request, response) => {
    if (!request.file) {
      throw new AppError('Nenhuma imagem encontrada', 500);
    }
    const avatar = request.file.filename;
    const adminsRouterRepository = getRepository(Admin);
    try {
      await adminsRouterRepository.update(request.user.id, {
        avatar,
      });
      const admin = await adminsRouterRepository.findOne(request.user.id);
      if (admin) {
        const parsedAdmin = admin as AdminWithoutPassword;
        delete parsedAdmin.password;
        return response.json(parsedAdmin);
      }
      return response.json({} as Admin);
    } catch (error) {
      throw new AppError('Nenhum Usuário encontrado', 500);
    }
  },
);

adminsRouter.get('/profile', async (request, response) => {
  const adminsRepository = getRepository(Admin);
  try {
    const admin = await adminsRepository.findOne(request.user.id);
    if (admin) {
      const parsedAdmin = admin as AdminWithoutPassword;
      delete parsedAdmin.password;
      return response.json(parsedAdmin);
    }
    return response.json({} as Admin);
  } catch (error) {
    console.log('Falha ao buscar perfil', error);

    throw new AppError('Falha ao buscar perfil', 500);
  }
});

adminsRouter.get('/usersToEvaluate', async (request, response) => {
  let usersToEvaluate: User[];
  const usersRepository = getRepository(User);
  try {
    const users = await usersRepository.find();
    usersToEvaluate = users.filter(user => {
      if (user.status === 'toEvaluate' && user.allow_access === false) {
        return true;
      }
      return false;
    });
    return response.json(usersToEvaluate);
  } catch (error) {
    throw new AppError('Falha ao buscar usuários aguardando aprovação', 500);
  }
});

adminsRouter.get('/approvedUsers', async (request, response) => {
  let approvedUsers: User[];
  const usersRepository = getRepository(User);
  try {
    const users = await usersRepository.find();
    approvedUsers = users.filter(user => {
      if (user.status === 'APROVADO' && user.allow_access === true) {
        return true;
      }
      return false;
    });
    return response.json(approvedUsers);
  } catch (error) {
    throw new AppError('Falha ao buscar usuários aprovados', 500);
  }
});

adminsRouter.put('/approveUser/:id', async (request, response) => {
  const { id } = request.params;
  const usersRepository = getRepository(User);

  try {
    const user = await usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new AppError(`Usuário (id: ${id} não encontrado`);
    }
    await usersRepository.update(
      { id },
      {
        allow_access: true,
        status: 'APROVADO',
      },
    );
    return response.json(user);
  } catch (error) {
    console.log(`Falha ao aprovar o usuário (id: ${id}): ${error}`);
    throw new AppError(`Falha ao aprovar o usuário (id: ${id}): ${error}`, 500);
  }
});
adminsRouter.put('/reproveUser/:id', async (request, response) => {
  const { id } = request.params;
  const usersRepository = getRepository(User);

  try {
    const user = await usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new AppError(`Usuário (id: ${id} não encontrado`);
    }
    await usersRepository.update(
      { id },
      {
        allow_access: false,
        status: 'REPROVADO',
      },
    );
    return response.json(user);
  } catch (error) {
    console.log(`Falha ao reprovar o usuário (id: ${id}): ${error}`);
    throw new AppError(
      `Falha ao reprovar o usuário (id: ${id}): ${error}`,
      500,
    );
  }
});
adminsRouter.delete('/deleteUser/:id', async (request, response) => {
  const { id } = request.params;
  const usersRepository = getRepository(User);

  try {
    await usersRepository.update(
      { id },
      {
        allow_access: false,
        status: 'DELETADO',
      },
    );
  } catch (error) {
    throw new AppError(`Falha ao deletar usuário (id: ${id}: ${error}`);
  }
  response.sendStatus(200);
});

export default adminsRouter;
