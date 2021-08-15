/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import AppError from '../errors/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
  avatar: string;
}
class CreateUserService {
  public async execute({
    name,
    email,
    password,
    avatar,
  }: Request): Promise<User> {
    const userRepository = getRepository(User);
    // TODO TryCatch?
    const checkUserExists = await userRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    const hashedPassword = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
      allow_access: false,
      status: 'toEvaluate',
      avatar,
    });

    await userRepository.save(user);

    return user;
  }
}
export default CreateUserService;
