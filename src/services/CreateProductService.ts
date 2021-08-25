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
  }: RequestCreateUser): Promise<Product> {
    const productRepository = getRepository(Product);
    console.log('Entrou no service de produtos');

    const productAlreadyExists = await productRepository.findOne({
      where: { name },
    });

    //Logica para preenchimento das variáveis de acordo com as regras de negócio estabelecidas
    if (!description) {
      description = `Valor total da nota fiscal: ${totalPurchaseAmount}`;
    }
    if (productAlreadyExists) {
      qty_last_order = productAlreadyExists.qty_ordered;
      qty_stocked = productAlreadyExists.qty_stocked + qty_ordered;
      max_stock_limit =
        qty_last_order > qty_stocked ? qty_last_order : qty_stocked;
    } else {
      qty_stocked = qty_ordered;
      max_stock_limit = qty_ordered;
      qty_last_order = qty_ordered;
    }
    //Fim das Regras de Negócio pro Salvamento de Produtos

    const product = productRepository.create({
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

    await productRepository.save(product);

    return product;
  }
}
export default CreateProductService;
