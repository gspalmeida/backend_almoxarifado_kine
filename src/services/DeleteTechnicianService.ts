/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import Technician from '../models/Technician';
import AppError from '../errors/AppError';
import CreateTechnicianService from '../services/CreateTechnicianService';
import UpdateServiceOrdersTechnicianToFillerService from '../services/UpdateServiceOrdersTechnicianToFillerService';

interface Request {
  id: Technician['id'];
}
class DeleteTechnicianService {
  public async execute({ id }: Request): Promise<Technician> {
    try {
      const technicianRepository = getRepository(Technician);
      const technicianToRemove = await technicianRepository.findOneOrFail({
        where: { id },
      });

      let fillerTechnician = await technicianRepository.findOne({
        where: { name: 'Técnico removido do sistema' },
      });
      if (!fillerTechnician) {
        const createTechnician = new CreateTechnicianService();

        fillerTechnician = await createTechnician.execute({
          name: 'Técnico removido do sistema',
        });
      }
      const changeTechnicianToFiller = new UpdateServiceOrdersTechnicianToFillerService();
      await changeTechnicianToFiller.execute({
        technicianId: id,
        fillerId: fillerTechnician.id,
      });

      await technicianRepository.remove(technicianToRemove);

      return fillerTechnician;
    } catch (error) {
      console.log('Falha ao remover técnico', error);

      throw new AppError(
        `Erro ao remover técnico: O id: ${id} não existe`,
        400,
      );
    }
  }
}
export default DeleteTechnicianService;
