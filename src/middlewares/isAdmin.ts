import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { getRepository } from 'typeorm';
import Admin from '../models/Admin';

import AppError from '../errors/AppError';
import authConfig from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default async function isAdmin(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = request.headers.authorization;
  const adminsRepository = getRepository(Admin);
  if (!authHeader) {
    throw new AppError('JWT token is missing!', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub: userId } = decoded as TokenPayload;

    const admin = await adminsRepository.findOne({ where: { id: userId } });

    if (!admin) {
      throw new AppError(
        'You dont have the credentials to access this route',
        401,
      );
    }
    request.user = {
      id: userId,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT token!', 401);
  }
}
