/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import ServiceOrder from '../models/ServiceOrder';
import Product from '../models/Product';
import AppError from '../errors/AppError';

interface materialProps {
  serviceOrderId: string;
  product_id: string;
  qty: number;
}

class ServiceOrderAddMaterialService {
  public async execute({
    serviceOrderId,
    qty,
    product_id,
  }: materialProps): Promise<ServiceOrder> {
    const serviceOrderRepository = getRepository(ServiceOrder);
    const productOrderRepository = getRepository(Product);
    console.log('Entrou no service ServiceOrderAddMaterialService');

    let serviceOrder = await serviceOrderRepository.findOne({
      where: { id: serviceOrderId },
    });

    let newMaterial = await productOrderRepository.findOne({
      where: { id: product_id },
    });

    if (!serviceOrder && !newMaterial) {
      console.log(
        `Campos obrigatórios: serviceOrder:${serviceOrder}, newMaterial:${newMaterial}`,
      );
      throw new AppError(
        `Campos obrigatórios: serviceOrder:${serviceOrder}, newMaterial:${newMaterial}`,
        500,
      );
    }
    const totalCost = Number(newMaterial!.unit_cost) * qty;
    // TODO Corrigir essa lógica pois ela gera registros duplicados ao invés de incrementar a quantidade
    await serviceOrderRepository.update(serviceOrderId, {
      materials: [
        ...serviceOrder!.materials,
        {
          name: newMaterial!.name,
          qty,
          unit_cost: newMaterial!.unit_cost,
          total_cost: totalCost,
        },
      ],
    });

    serviceOrder = await serviceOrderRepository.findOneOrFail({
      where: { id: serviceOrderId },
    });
    return serviceOrder;
  }
}
export default ServiceOrderAddMaterialService;
