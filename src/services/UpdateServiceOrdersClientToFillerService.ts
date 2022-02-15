/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Client from '../models/Client';
import ServiceOrder from '../models/ServiceOrder';

export interface RequestUpdateServiceOrdersClientToFillerService {
  clientId: Client['id'];
  fillerId: Client['id'];
}
class UpdateServiceOrdersClientToFillerService {
  public async execute({
    clientId,
    fillerId,
  }: RequestUpdateServiceOrdersClientToFillerService): Promise<ServiceOrder[]> {
    try {
      const serviceOrderRepository = getRepository(ServiceOrder);
      const clientRepository = getRepository(Client);

      const serviceOrders = await serviceOrderRepository.find({
        where: { client: clientId },
      });

      const clientFiller = await clientRepository.findOneOrFail({
        where: { id: fillerId },
      });

      if (!serviceOrders) {
        console.log(
          `Nenhuma ordem de serviço encontrada: \n Id do cliente ${clientId}`,
        );
        throw new AppError(
          `Nenhuma ordem de serviço encontrada: \n Id do cliente ${clientId}`,
          404,
        );
      }

      serviceOrders.forEach(async function (serviceOrder) {
        serviceOrder.client = clientFiller;
        await serviceOrderRepository.save(serviceOrder);
      });

      return serviceOrders;
    } catch (error) {
      console.log(
        `Erro ao substituir o cliente pelo preenchimento "Cliente removido do sistema" \n clientId: ${clientId} \n fillerId:${fillerId}\n\n`,
      );
      console.log(error);

      throw new AppError(
        `Erro ao substituir o cliente pelo preenchimento "Cliente removido do sistema" \n clientId: ${clientId} \n fillerId:${fillerId}\n\n`,
        500,
      );
    }
  }
}
export default UpdateServiceOrdersClientToFillerService;
