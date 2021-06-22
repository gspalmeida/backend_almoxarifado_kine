/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import Admin from '../models/Admin';
import AppError from '../errors/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
  avatar: string;
}
class CreateAdminService {
  public async execute({
    name,
    email,
    password,
    avatar,
  }: Request): Promise<Admin> {
    const adminRepository = getRepository(Admin);

    const checkAdminExists = await adminRepository.findOne({
      where: { email },
    });

    if (checkAdminExists) {
      throw new AppError('Email address already used.');
    }

    const hashedPassword = await hash(password, 8);

    const admin = adminRepository.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    await adminRepository.save(admin);

    return admin;
  }
}
export default CreateAdminService;
