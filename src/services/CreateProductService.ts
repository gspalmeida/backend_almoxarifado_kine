/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import Product from '../models/Product';
import AppError from '../errors/AppError';

export interface RequestCreateUser {
  name: string;
  description: string;
  unit_cost: number;
  unit_last_cost: number;
  qty_ordered: number;
  qty_last_order: number;
  qty_stocked: number;
  qty_stock_limit: number;
  unitMeasureId: string;
  lastSupplierId: string;
  costCenterId: string;
}
class CreateProductService {
  public async execute({
    name,
    description,
    unit_cost,
    unit_last_cost,
    qty_ordered,
    qty_last_order,
    qty_stocked,
    qty_stock_limit,
    unitMeasureId,
    lastSupplierId,
    costCenterId,
  }: RequestCreateUser): Promise<Product> {
    const productRepository = getRepository(Product);

    const checkProductExists = await productRepository.findOne({
      where: { name },
    });

    if (checkProductExists) {
      throw new AppError('O Produto já existe tem que chamar o update');
    }

    const product = productRepository.create({
      name,
      description,
      unit_cost,
      unit_last_cost,
      qty_ordered,
      qty_last_order,
      qty_stocked,
      qty_stock_limit,
    });

    await productRepository.save(product);

    return product;
  }
}
export default CreateProductService;
