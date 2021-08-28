/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import Product from '../models/Product';
import AppError from '../errors/AppError';

export interface RequestAlterProductQtyStocked {
  id?: Product['id'];
  name?: Product['name'];
  changeQty: number;
  actionType: 'subtraction' | 'addition';
}
class AlterProductQtyStockedService {
  public async execute({
    id,
    name,
    changeQty,
    actionType,
  }: RequestAlterProductQtyStocked): Promise<Product> {
    try {
      const productRepository = getRepository(Product);
      let newProductData = {} as Product;
      let oldProductData;

      if (id) {
        oldProductData = await productRepository.findOne({
          where: { id },
        });
      }
      if (name) {
        oldProductData = await productRepository.findOne({
          where: { name },
        });
      }
      console.log('AlterProductQtyService\n\n idOrName:', name, id);
      console.log('\n oldProductData:', oldProductData);

      if (!oldProductData) {
        throw new AppError('Produto não encontrado no estoque', 404);
      }

      if (actionType === 'subtraction') {
        const newQtyStocked = oldProductData.qty_stocked - changeQty;
        if (newQtyStocked < 0) {
          throw new AppError(
            'Você está tentando alocar mais itens a uma Ordem de Servico do que a quantidade disponível em estoque',
            400,
          );
        }
        newProductData = {
          ...oldProductData,
          qty_stocked: newQtyStocked,
        };
      }
      console.log('\n\nchange', changeQty);
      console.log('new', newProductData.qty_stocked);
      console.log('complete', newProductData);
      if (actionType === 'addition') {
        newProductData = {
          ...oldProductData,
          qty_stocked: oldProductData.qty_stocked + changeQty,
        };
      }
      console.log('\n\nchange', changeQty);
      console.log('new', newProductData.qty_stocked);
      console.log('complete', newProductData);
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
export default AlterProductQtyStockedService;
