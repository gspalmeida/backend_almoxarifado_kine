/* eslint-disable camelcase */
import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

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

export default usersRouter;
