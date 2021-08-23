/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import Supplier from '../models/Supplier';
import AppError from '../errors/AppError';

interface Request {
  name: string;
}
class CreateSupplierService {
  public async execute({ name }: Request): Promise<Supplier> {
    const supplierRepository = getRepository(Supplier);

    const checkSupplierExists = await supplierRepository.findOne({
      where: { name },
    });

    if (checkSupplierExists) {
      throw new AppError(
        'O fornecedor já existe (impossível criar 2 com o mesmo nome)',
      );
    }

    const supplier = supplierRepository.create({
      name,
    });

    await supplierRepository.save(supplier);

    return supplier;
  }
}
export default CreateSupplierService;
