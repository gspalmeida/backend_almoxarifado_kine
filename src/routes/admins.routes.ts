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

adminsRouter.get('/profile', async (request, response) => {
  const adminsRepository = getRepository(Admin);
  try {
    const admin = await adminsRepository.findOne(request.user.id);
    return response.json(admin);
  } catch (error) {
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
    throw new AppError('None users found', 500);
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
    throw new AppError('None users found', 500);
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
      throw new AppError('User Id not Found');
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
    console.log(
      `Failed on update the user aproval status with the error: ${error}`,
    );
    throw new AppError(
      `Failed on update the user aproval status with the error: ${error}`,
      500,
    );
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
      throw new AppError('User Id not Found');
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
    console.log(
      `Failed on update the user aproval status with the error: ${error}`,
    );
    throw new AppError(
      `Failed on update the user aproval status with the error: ${error}`,
      500,
    );
  }
});
adminsRouter.delete('/users/:id', async (request, response) => {
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
    throw new AppError('Failed on Disaprove the user');
  }
  response.sendStatus(200);
});

export default adminsRouter;
