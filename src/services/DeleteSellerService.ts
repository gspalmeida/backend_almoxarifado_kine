/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import Seller from '../models/Seller';
import AppError from '../errors/AppError';
import CreateSellerService from '../services/CreateSellerService';
import UpdateServiceOrdersSellerToFillerService from './UpdateServiceOrdersSellerToFillerService';

interface Request {
  id: Seller['id'];
}
class DeleteSellerService {
  public async execute({ id }: Request): Promise<Seller> {
    try {
      const sellerRepository = getRepository(Seller);
      const sellerToRemove = await sellerRepository.findOneOrFail({
        where: { id },
      });

      let fillerSeller = await sellerRepository.findOne({
        where: { name: 'Vendedor removido do sistema' },
      });
      if (!fillerSeller) {
        const createFiller = new CreateSellerService();

        fillerSeller = await createFiller.execute({
          name: 'Vendedor removido do sistema',
        });
      }
      const changeSellerToFiller = new UpdateServiceOrdersSellerToFillerService();
      await changeSellerToFiller.execute({
        sellerId: id,
        fillerId: fillerSeller.id,
      });

      await sellerRepository.remove(sellerToRemove);

      return fillerSeller;
    } catch (error) {
      console.log('Falha ao remover vendedor', error);

      throw new AppError(
        `Erro ao remover vendedor: O id: ${id} não existe`,
        400,
      );
    }
  }
}
export default DeleteSellerService;
