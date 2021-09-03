/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import ServiceOrder from '../models/ServiceOrder';
import AppError from '../errors/AppError';

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
      // TODO Os "AppError" dentro de um trycatch interno retornam pro front o erro do trycatch externo (interno = service; externo = rota)
      throw new AppError(
        `Você entá tentando retornar mais materiais para o estoque do que a quantidade alocada para essa OS`,
        400,
      );
    }

    const newQty = productToReturn.qty - qty;

    let returnedMaterial: ServiceOrderMaterialProps = {
      name: productToReturn.name,
      unit_cost: productToReturn.unit_cost,
      qty: newQty,
      total_cost: Number(productToReturn.unit_cost) * newQty,
    };

    let notRetunedMaterials = serviceOrder.materials.filter(
      el => el.name !== returnedMaterial!.name,
    );

    await serviceOrderRepository.update(serviceOrderId, {
      materials: [...notRetunedMaterials, returnedMaterial!],
    });

    serviceOrder = await serviceOrderRepository.findOneOrFail({
      where: { id: serviceOrderId },
    });
    return serviceOrder;
  }
}
export default ServiceOrderReturnMaterialService;
