/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import Seller from '../models/Seller';
import AppError from '../errors/AppError';

interface Request {
  id: Seller['id'];
  name: Seller['name'];
}
class UpdateSellerService {
  public async execute({ id, name }: Request): Promise<Seller> {
    try {
      const sellerRepository = getRepository(Seller);
      const sellerToUpdate = await sellerRepository.findOneOrFail({
        where: { id },
      });

      if (!sellerToUpdate) {
        throw new AppError('Vendedor não encontrado');
      }
      await sellerRepository.update(
        { id },
        {
          name,
        },
      );

      const updatedSeller = await sellerRepository.findOneOrFail({
        where: { id },
      });

      return updatedSeller;
    } catch (error) {
      console.log('Falha ao atualizar vendedor', error);

      throw new AppError(
        `Erro ao atualizar vendedor: O id: ${id} não foi encontrado na base de dados; Erro: ${error}`,
        400,
      );
    }
  }
}
export default UpdateSellerService;
