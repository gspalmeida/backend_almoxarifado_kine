/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import Product from '../models/Product';
import AppError from '../errors/AppError';
import MeasureUnit from '../models/MeasureUnit';
import Supplier from '../models/Supplier';
import CostCenter from '../models/CostCenter';

export interface RequestCreateUser {
  name: string;
  description: string;
  unit_cost: number;
  unit_last_cost: number;
  qty_ordered: number;
  qty_last_order: number;
  qty_stocked: number;
  qty_stock_limit: number;
  unitMeasureId: MeasureUnit;
  lastSupplierId: Supplier;
  costCenterId: CostCenter;
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
    console.log('Entrou no service de produtos');

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
      measure_unit: unitMeasureId,
      last_supplier: lastSupplierId,
      cost_center: costCenterId,
    });

    await productRepository.save(product);

    return product;
  }
}
export default CreateProductService;
