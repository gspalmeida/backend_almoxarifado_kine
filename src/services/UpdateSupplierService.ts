/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import Supplier from '../models/Supplier';
import AppError from '../errors/AppError';

interface Request {
  id: Supplier['id'];
  name: Supplier['name'];
}
class UpdateSupplierService {
  public async execute({ id, name }: Request): Promise<Supplier> {
    try {
      const supplierRepository = getRepository(Supplier);
      const supplierToUpdate = await supplierRepository.findOneOrFail({
        where: { id },
      });

      if (!supplierToUpdate) {
        throw new AppError('Fornecedor não encontrado');
      }
      await supplierRepository.update(
        { id },
        {
          name,
        },
      );

      const updatedSupplier = await supplierRepository.findOneOrFail({
        where: { id },
      });

      return updatedSupplier;
    } catch (error) {
      console.log('Falha ao atualizar fornecedor', error);

      throw new AppError(
        `Erro ao atualizar fornecedor: O id: ${id} não foi encontrado na base de dados; Erro: ${error}`,
        400,
      );
    }
  }
}
export default UpdateSupplierService;
