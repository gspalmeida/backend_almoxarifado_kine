/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import Product from '../models/Product';
import AppError from '../errors/AppError';
import MeasureUnit from '../models/MeasureUnit';
import Supplier from '../models/Supplier';
import CostCenter from '../models/CostCenter';

export interface RequestCreateProduct {
  name: string;
  description?: string;
  unit_cost: string;
  qty_ordered: number;
  qty_last_order?: number;
  qty_stocked?: number;
  max_stock_limit?: number;
  unitMeasureId: MeasureUnit;
  lastSupplierId: Supplier;
  costCenterId: CostCenter;
  totalPurchaseAmount?: string;
}
class CreateProductService {
  public async execute({
    name,
    description,
    unit_cost,
    qty_ordered,
    qty_last_order,
    qty_stocked,
    max_stock_limit,
    unitMeasureId,
    lastSupplierId,
    costCenterId,
    totalPurchaseAmount,
  }: RequestCreateProduct): Promise<Product> {
    const productRepository = getRepository(Product);
    console.log('Entrou no service de produtos');

    const productAlreadyExists = await productRepository.findOne({
      where: { name },
    });

    let product: RequestCreateProduct = {
      name,
      qty_ordered,
      unit_cost,
      unitMeasureId,
      lastSupplierId,
      costCenterId,
    };

    if (!description) {
      description = `Valor total da nota fiscal: ${totalPurchaseAmount}`;
      product = { ...product, description };
    }

    if (productAlreadyExists) {
      console.log('\n\n\nEntrou no update');
      qty_last_order = productAlreadyExists.qty_ordered;
      qty_stocked = productAlreadyExists.qty_stocked + qty_ordered;
      max_stock_limit =
        qty_last_order > qty_stocked ? qty_last_order : qty_stocked;

      console.log(
        'maxStock: %s qtyStocked: %s qtyLasOrder: %s',
        qty_last_order,
        qty_stocked,
        max_stock_limit,
      );

      console.log('\n\nproductAlreadyExists:', productAlreadyExists);
      console.log('\nproduct antes:', product);

      product = {
        ...productAlreadyExists,
        ...product,
        qty_last_order,
        qty_stocked,
        max_stock_limit,
      };
      console.log('\nproduct depois:', product);

      const updatedProduct = await productRepository.save(product);
      return updatedProduct;
    } else {
      qty_stocked = qty_ordered;
      max_stock_limit = qty_ordered;
      qty_last_order = qty_ordered;

      const createProduct = productRepository.create({
        name,
        qty_ordered,
        unit_cost,
        description,
        qty_last_order,
        qty_stocked,
        max_stock_limit,
        measure_unit: unitMeasureId,
        last_supplier: lastSupplierId,
        cost_center: costCenterId,
      });
      const newProduct = await productRepository.save(createProduct);
      return newProduct;
    }
  }
}
export default CreateProductService;
