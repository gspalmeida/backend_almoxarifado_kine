/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import ServiceOrder from '../models/ServiceOrder';
import ProductOrder from '../models/Product';
import AppError from '../errors/AppError';
import Seller from '../models/Seller';
import Client from '../models/Client';
import Technician from '../models/Technician';

interface AddMaterialServiceOrder {
  id: string;
  product_id: string;
  qty: number;
}

class AddMaterialService {
  public async execute({
    id,
    qty,
    product_id,
  }: AddMaterialServiceOrder): Promise<ServiceOrder> {
    const serviceOrderRepository = getRepository(ServiceOrder);
    const productOrderRepository = getRepository(ProductOrder);
    console.log('Entrou no service de addMaterial');

    let serviceOrder = await serviceOrderRepository.findOne({
      where: { id },
    });

    let productOrder = await productOrderRepository.findOne({
      where: { id: product_id },
    });

    if (serviceOrder && productOrder && productOrder.unit_cost) {
      const totalCost = Number(productOrder.unit_cost) * qty;
      await serviceOrderRepository.update(id, {
        materials: [
          ...serviceOrder.materials,
          {
            name: productOrder.name,
            qty,
            unit_cost: productOrder.unit_cost,
            total_cost: totalCost,
          },
        ],
      });
    } else {
      throw new AppError('Nenhuma Ordem de Serviço encontrada', 500);
    }
    serviceOrder = await serviceOrderRepository.findOneOrFail({
      where: { id },
    });
    return serviceOrder;
  }
}
export default AddMaterialService;
