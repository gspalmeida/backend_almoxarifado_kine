/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import Product from '../models/Product';
import AppError from '../errors/AppError';

export interface AlterProductQtyStockedService {
  id: Product['id'];
  changeQty: number;
  actionType: 'subtraction' | 'addition';
}
class RemoveProductFromInventoryService {
  public async execute({
    id,
    changeQty,
    actionType,
  }: AlterProductQtyStockedService): Promise<Product> {
    try {
      const productRepository = getRepository(Product);
      let newProductData = {} as Product;

      const productAlreadyExists = await productRepository.findOne({
        where: { id },
      });

      if (!productAlreadyExists) {
        console.log('Antes do app error de not found');
        throw new AppError('Produto não encontrado no estoque', 404);
      }
      console.log('\n\n\n\n\nold', productAlreadyExists.qty_stocked);

      if (actionType === 'subtraction') {
        newProductData = {
          ...productAlreadyExists,
          qty_stocked: productAlreadyExists.qty_stocked - changeQty,
        };
      }
      console.log('\n\n\n\n\nchange', changeQty);
      console.log('\n\n\n\n\nnew', newProductData.qty_stocked);
      console.log('\n\n\n\n\ncomplete', newProductData);
      if (actionType === 'addition') {
        newProductData = {
          ...productAlreadyExists,
          qty_stocked: productAlreadyExists.qty_stocked + changeQty,
        };
      }
      const updatedProduct = await productRepository.save(newProductData);
      return updatedProduct;
    } catch (error) {
      console.log(
        `Erro ao atualizar o produto no estoque actionType:${actionType}`,
      );
      throw new AppError('Erro ao atualizar o produto no estoque');
    }
  }
}
export default RemoveProductFromInventoryService;
