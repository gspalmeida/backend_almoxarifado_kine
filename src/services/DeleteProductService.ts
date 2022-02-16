/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import Product from '../models/Product';
import AppError from '../errors/AppError';
import CreateProductService from '../services/CreateProductService';
import UpdateProductsSupplierToFillerService from '../services/UpdateProductsSupplierToFillerService';

interface Request {
  id: Product['id'];
}
class DeleteProductService {
  public async execute({ id }: Request): Promise<Product> {
    try {
      const productRepository = getRepository(Product);
      const productToRemove = await productRepository.findOneOrFail({
        where: { id },
      });
      const productDelectedStatus = await productRepository.remove(
        productToRemove,
      );
      return productDelectedStatus;
    } catch (error) {
      console.log('Falha ao remover produto', error);

      throw new AppError(
        `Erro ao remover produto: O id: ${id} não existe`,
        400,
      );
    }
  }
}
export default DeleteProductService;
