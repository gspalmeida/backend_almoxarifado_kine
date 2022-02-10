/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import Seller from '../models/Seller';
import AppError from '../errors/AppError';
import CreateSellerService from '../services/CreateSellerService';
import AlterServiceOrdersSellerToFillerService from '../services/AlterServiceOrdersSellerToFillerService';

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
        where: { name: 'Vendedor Removido do Sistema' },
      });
      if (!fillerSeller) {
        const createSeller = new CreateSellerService();

        fillerSeller = await createSeller.execute({
          name: 'Vendedor Removido do Sistema',
        });
      }
      const changeSellerToFillerSeller = new AlterServiceOrdersSellerToFillerService();
      await changeSellerToFillerSeller.execute({
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
