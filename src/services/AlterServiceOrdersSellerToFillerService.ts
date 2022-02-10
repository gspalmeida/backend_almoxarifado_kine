/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Seller from '../models/Seller';
import ServiceOrder from '../models/ServiceOrder';

export interface RequestAlterServiceOrdersSellerToFillerService {
  sellerId: Seller['id'];
  fillerId: Seller['id'];
}
class AlterServiceOrdersSellerToFillerService {
  public async execute({
    sellerId,
    fillerId,
  }: RequestAlterServiceOrdersSellerToFillerService): Promise<ServiceOrder[]> {
    try {
      const serviceOrderRepository = getRepository(ServiceOrder);
      const sellerRepository = getRepository(Seller);

      const serviceOrders = await serviceOrderRepository.find({
        where: { seller: sellerId },
      });

      const sellerFiller = await sellerRepository.findOneOrFail({
        where: { id: fillerId },
      });

      if (!serviceOrders) {
        console.log(
          `Nenhuma ordem de serviço encontrada: \n serviceOrders: Id do vendedor ${sellerId}`,
        );
        throw new AppError(
          `Nenhuma ordem de serviço encontrada: \n serviceOrders: Id do vendedor ${sellerId}`,
          404,
        );
      }

      serviceOrders.forEach(async function (serviceOrder) {
        serviceOrder.seller = sellerFiller;
        await serviceOrderRepository.save(serviceOrder);
      });

      return serviceOrders;
    } catch (error) {
      console.log(
        `Erro ao substituior o vendedor pelo preenchimento "Vendedor Removido do Sistema" \n sellerId: ${sellerId} \n fillerId:${fillerId}\n\n`,
      );
      console.log(error);

      throw new AppError(
        `Erro ao substituior o vendedor pelo preenchimento "Vendedor Removido do Sistema" \n sellerId: ${sellerId} \n fillerId:${fillerId}\n\n`,
        500,
      );
    }
  }
}
export default AlterServiceOrdersSellerToFillerService;
