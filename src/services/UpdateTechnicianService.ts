/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import Technician from '../models/Technician';
import AppError from '../errors/AppError';

interface Request {
  id: Technician['id'];
  name: Technician['name'];
}
class UpdateTechnicianService {
  public async execute({ id, name }: Request): Promise<Technician> {
    try {
      const technicianRepository = getRepository(Technician);
      const technicianToUpdate = await technicianRepository.findOneOrFail({
        where: { id },
      });

      if (!technicianToUpdate) {
        throw new AppError('Técnico não encontrado');
      }
      await technicianRepository.update(
        { id },
        {
          name,
        },
      );

      const updatedTechnician = await technicianRepository.findOneOrFail({
        where: { id },
      });

      return updatedTechnician;
    } catch (error) {
      console.log('Falha ao atualizar técnico', error);

      throw new AppError(
        `Erro ao atualizar técnico: O id: ${id} não foi encontrado na base de dados; Erro: ${error}`,
        400,
      );
    }
  }
}
export default UpdateTechnicianService;
