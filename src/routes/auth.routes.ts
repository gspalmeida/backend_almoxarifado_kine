/* eslint-disable camelcase */
import { Router } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';
import AuthenticateAdminService from '../services/AuthenticateAdminService';

interface UserWithoutPassword {
  email: string;
  password?: string;
}
interface AdminWithoutPassword {
  email: string;
  password?: string;
}
interface ResponseData {
  admin?: AdminWithoutPassword;
  user?: UserWithoutPassword;
  token: string;
}
const authRouter = Router();

authRouter.post('/', async (request, response) => {
  let responseData: ResponseData = {
    admin: {} as AdminWithoutPassword,
    user: {} as UserWithoutPassword,
    token: '',
  };
  const { email, password } = request.body;
  const authenticateUser = new AuthenticateUserService();
  const authenticateAdmin = new AuthenticateAdminService();

  const { admin, token: adminToken } = await authenticateAdmin.execute({
    email,
    password,
  });
  if (admin.email) {
    const parsedAdmin: AdminWithoutPassword = admin;
    delete parsedAdmin.password;
    responseData = { admin: parsedAdmin, token: adminToken };
  }
  if (!admin.email) {
    const { user, token: userToken } = await authenticateUser.execute({
      email,
      password,
    });
    const parsedUser: UserWithoutPassword = user;
    delete parsedUser.password;
    responseData = { user: parsedUser, token: userToken };
  }
  return response.json(responseData);
});

export default authRouter;
