/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Seller from '../models/Seller';
import ServiceOrder from '../models/ServiceOrder';

export interface RequestUpdateServiceOrdersSellerToFillerService {
  sellerId: Seller['id'];
  fillerId: Seller['id'];
}
class UpdateServiceOrdersSellerToFillerService {
  public async execute({
    sellerId,
    fillerId,
  }: RequestUpdateServiceOrdersSellerToFillerService): Promise<ServiceOrder[]> {
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
          `Nenhuma ordem de serviço encontrada: \n Id do vendedor ${sellerId}`,
        );
        throw new AppError(
          `Nenhuma ordem de serviço encontrada: \n Id do vendedor ${sellerId}`,
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
        `Erro ao substituir o vendedor pelo preenchimento "Vendedor removido do sistema" \n sellerId: ${sellerId} \n fillerId:${fillerId}\n\n`,
      );
      console.log(error);

      throw new AppError(
        `Erro ao substituir o vendedor pelo preenchimento "Vendedor removido do sistema" \n sellerId: ${sellerId} \n fillerId:${fillerId}\n\n`,
        500,
      );
    }
  }
}
export default UpdateServiceOrdersSellerToFillerService;
