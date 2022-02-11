/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import Supplier from '../models/Supplier';
import AppError from '../errors/AppError';
import CreateSupplierService from '../services/CreateSupplierService';
import UpdateProductsSupplierToFillerService from '../services/UpdateProductsSupplierToFillerService';

interface Request {
  id: Supplier['id'];
}
class DeleteSupplierService {
  public async execute({ id }: Request): Promise<Supplier> {
    try {
      const supplierRepository = getRepository(Supplier);
      const supplierToRemove = await supplierRepository.findOneOrFail({
        where: { id },
      });

      let fillerSupplier = await supplierRepository.findOne({
        where: { name: 'Fornecedor removido do sistema' },
      });
      if (!fillerSupplier) {
        const createSupplier = new CreateSupplierService();

        fillerSupplier = await createSupplier.execute({
          name: 'Fornecedor removido do sistema',
        });
      }
      const changeSupplierToFiller = new UpdateProductsSupplierToFillerService();
      await changeSupplierToFiller.execute({
        supplierId: id,
        fillerId: fillerSupplier.id,
      });

      await supplierRepository.remove(supplierToRemove);

      return fillerSupplier;
    } catch (error) {
      console.log('Falha ao remover fornecedor', error);

      throw new AppError(
        `Erro ao remover fornecedor: O id: ${id} não existe`,
        400,
      );
    }
  }
}
export default DeleteSupplierService;
