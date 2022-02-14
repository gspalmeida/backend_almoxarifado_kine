/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import ServiceOrder from '../models/ServiceOrder';
import AppError from '../errors/AppError';
import AlterServiceOrderTotalCostService from './AlterServiceOrderTotalCostService';

interface RequestReturnMaterial {
  serviceOrderId: string;
  returnedProductName: string;
  qty: number;
}
interface ServiceOrderMaterialProps {
  name: string;
  qty: number;
  unit_cost: string;
  total_cost: number;
}

class ServiceOrderReturnMaterialService {
  public async execute({
    serviceOrderId,
    returnedProductName,
    qty,
  }: RequestReturnMaterial): Promise<ServiceOrder> {
    const serviceOrderRepository = getRepository(ServiceOrder);

    let serviceOrder = await serviceOrderRepository.findOne({
      where: { id: serviceOrderId },
    });
    if (!serviceOrder) {
      throw new AppError(`Ordem de serviço não encontrada`, 404);
    }

    const productToReturn = serviceOrder.materials.find(
      material => material.name === returnedProductName,
    );
    if (!productToReturn) {
      throw new AppError(
        `Material Retornado(${returnedProductName}) não existe na serviceOrder: ${serviceOrder.number}, materials ${serviceOrder.materials}`,
        500,
      );
    }
    if (productToReturn!.qty < qty) {
      throw new AppError(
        `Você entá tentando retornar mais materiais para o estoque do que a quantidade alocada para essa OS. O limite para esse produto é: ${productToReturn.qty}`,
        400,
      );
    }

    const newMaterialQty = productToReturn.qty - qty;
    const newMaterialTotalCost =
      Number(productToReturn.unit_cost) * newMaterialQty;

    let returnedMaterial: ServiceOrderMaterialProps = {
      name: productToReturn.name,
      unit_cost: productToReturn.unit_cost,
      qty: newMaterialQty,
      total_cost: newMaterialTotalCost,
    };

    let notRetunedMaterials = serviceOrder.materials.filter(
      el => el.name !== returnedMaterial!.name,
    );

    await serviceOrderRepository.update(serviceOrderId, {
      materials: [...notRetunedMaterials, returnedMaterial!],
    });
    const serviceOrderTotalCostAfterUpdateMaterials =
      productToReturn.total_cost - newMaterialTotalCost;
    const updateServiceOrderTotalCost = new AlterServiceOrderTotalCostService();
    const updatedTotalCost = await updateServiceOrderTotalCost.execute({
      serviceOrderId,
      value: serviceOrderTotalCostAfterUpdateMaterials,
      actionType: 'subtraction',
    });

    serviceOrder = await serviceOrderRepository.findOneOrFail({
      where: { id: serviceOrderId },
    });
    return serviceOrder;
  }
}
export default ServiceOrderReturnMaterialService;
