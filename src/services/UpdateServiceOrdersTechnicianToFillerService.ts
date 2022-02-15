/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Technician from '../models/Technician';
import ServiceOrder from '../models/ServiceOrder';

export interface RequestUpdateServiceOrdersTechnicianToFillerService {
  technicianId: Technician['id'];
  fillerId: Technician['id'];
}
class UpdateServiceOrdersTechnicianToFillerService {
  public async execute({
    technicianId,
    fillerId,
  }: RequestUpdateServiceOrdersTechnicianToFillerService): Promise<
    ServiceOrder[]
  > {
    try {
      const serviceOrderRepository = getRepository(ServiceOrder);
      const technicianRepository = getRepository(Technician);

      const serviceOrders = await serviceOrderRepository.find({
        where: { technician: technicianId },
      });

      const technicianFiller = await technicianRepository.findOneOrFail({
        where: { id: fillerId },
      });

      if (!serviceOrders) {
        console.log(
          `Nenhuma ordem de serviço encontrada: \n Id do técnico ${technicianId}`,
        );
        throw new AppError(
          `Nenhuma ordem de serviço encontrada: \n Id do técnico ${technicianId}`,
          404,
        );
      }

      serviceOrders.forEach(async function (serviceOrder) {
        serviceOrder.technician = technicianFiller;
        await serviceOrderRepository.save(serviceOrder);
      });

      return serviceOrders;
    } catch (error) {
      console.log(
        `Erro ao substituir o técnico pelo preenchimento "Técnico removido do sistema" \n technicianId: ${technicianId} \n fillerId:${fillerId}\n\n`,
      );
      console.log(error);

      throw new AppError(
        `Erro ao substituir o técnico pelo preenchimento "Técnico removido do sistema" \n technicianId: ${technicianId} \n fillerId:${fillerId}\n\n`,
        500,
      );
    }
  }
}
export default UpdateServiceOrdersTechnicianToFillerService;
