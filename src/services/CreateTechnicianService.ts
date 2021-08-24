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
      throw new AppError(
        'O Técnico já existe (impossível criar 2 com o mesmo nome)',
      );
    }

    const technician = technicianRepository.create({
      name,
    });

    await technicianRepository.save(technician);

    return technician;
  }
}
export default CreateTechnicianService;
