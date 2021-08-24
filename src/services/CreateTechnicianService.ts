/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import Technician from '../models/Technician';
import AppError from '../errors/AppError';

interface Request {
  name: string;
}
class CreateTechnicianService {
  public async execute({ name }: Request): Promise<Technician> {
    const technicianRepository = getRepository(Technician);

    const checkTechnicianExists = await technicianRepository.findOne({
      where: { name },
    });

    if (checkTechnicianExists) {
      return checkTechnicianExists;
    }

    const technician = technicianRepository.create({
      name,
    });

    await technicianRepository.save(technician);

    return technician;
  }
}
export default CreateTechnicianService;
