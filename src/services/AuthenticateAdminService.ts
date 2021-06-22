/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import Admin from '../models/Admin';
import authConfig from '../config/auth';
import AppError from '../errors/AppError';

interface Request {
  email: string;
  password: string;
}
interface Response {
  admin: Admin;
  token: string;
}

class AuthenticateAdminService {
  public async execute({ email, password }: Request): Promise<Response> {
    const adminRepository = getRepository(Admin);

    const admin = await adminRepository.findOne({ where: { email } });
    if (admin) {
      const passwordMatched = await compare(password, admin.password);
      if (!passwordMatched) {
        throw new AppError('Incorrect email/password combination', 401);
      }
      const { secret, expiresIn } = authConfig.jwt;

      const token = sign({}, secret, {
        subject: admin.id,
        expiresIn,
      });

      return {
        admin,
        token,
      };
    }
    return { admin: {} as Admin, token: '' };
  }
}

export default AuthenticateAdminService;
