/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Supplier from '../models/Supplier';
import Product from '../models/Product';

export interface RequestUpdateProductsSupplierToFillerService {
  supplierId: Supplier['id'];
  fillerId: Supplier['id'];
}
class UpdateProductsSupplierToFillerService {
  public async execute({
    supplierId,
    fillerId,
  }: RequestUpdateProductsSupplierToFillerService): Promise<Product[]> {
    try {
      const productRepository = getRepository(Product);
      const supplierRepository = getRepository(Supplier);

      const products = await productRepository.find({
        where: { last_supplier: supplierId },
      });

      const supplierFiller = await supplierRepository.findOneOrFail({
        where: { id: fillerId },
      });

      if (!products) {
        console.log(`Nenhum produto encontrado com o fornecedor ${supplierId}`);
        throw new AppError(
          `Nenhum produto encontrado com o fornecedor ${supplierId}`,
          404,
        );
      }

      products.forEach(async function (product) {
        product.last_supplier = supplierFiller;
        await productRepository.save(product);
      });

      return products;
    } catch (error) {
      console.log(
        `Erro ao substituir o fornecedor pelo preenchimento "Fornecedor removido do sistema" \n supplierId: ${supplierId} \n fillerId:${fillerId}\n\n`,
      );
      console.log(error);

      throw new AppError(
        `Erro ao substituir o fornecedor pelo preenchimento "Fornecedor removido do sistema" \n supplierId: ${supplierId} \n fillerId:${fillerId}\n\n`,
        500,
      );
    }
  }
}
export default UpdateProductsSupplierToFillerService;
