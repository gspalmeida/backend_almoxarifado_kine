/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import Product from '../models/Product';
import AppError from '../errors/AppError';

interface Request {
  id: Product['id'];
  name: Product['name'];
  description: Product['description'];
  unit_cost: Product['unit_cost'];
  qty_stocked: Product['qty_stocked'];
  max_stock_limit: Product['max_stock_limit'];
}
class UpdateProductService {
  public async execute({
    id,
    name,
    description,
    unit_cost,
    qty_stocked,
    max_stock_limit,
  }: Request): Promise<Product> {
    try {
      const productRepository = getRepository(Product);
      const productToUpdate = await productRepository.findOneOrFail({
        where: { id },
      });

      if (qty_stocked > max_stock_limit) {
        max_stock_limit = qty_stocked;
      }

      if (!productToUpdate) {
        throw new AppError('Produto não encontrado');
      }
      await productRepository.update(
        { id },
        {
          name,
          description,
          unit_cost,
          qty_stocked,
          max_stock_limit,
        },
      );

      const updatedProduct = await productRepository.findOneOrFail({
        where: { id },
      });

      return updatedProduct;
    } catch (error) {
      console.log('Falha ao atualizar produto', error);

      throw new AppError(
        `Erro ao atualizar produto: O id: ${id} não foi encontrado na base de dados; Erro: ${error}`,
        400,
      );
    }
  }
}
export default UpdateProductService;
