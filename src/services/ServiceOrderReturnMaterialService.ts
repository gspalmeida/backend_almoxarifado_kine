/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import ServiceOrder from '../models/ServiceOrder';
import Product from '../models/Product';
import AppError from '../errors/AppError';

interface RequestReturnMaterial {
  serviceOrderId: string;
  product_name: string;
  qty: number;
}
interface MaterialProps {
  name: string;
  qty: number;
  unit_cost: string;
  total_cost: number;
}

class ServiceOrderReturnMaterialService {
  public async execute({
    serviceOrderId,
    product_name,
    qty,
  }: RequestReturnMaterial): Promise<ServiceOrder> {
    const serviceOrderRepository = getRepository(ServiceOrder);

    let serviceOrder = await serviceOrderRepository.findOne({
      where: { id: serviceOrderId },
    });

    if (!serviceOrder) {
      throw new AppError(`Ordem de serviço não encontrada`, 404);
    }
    const materialToReturn = serviceOrder.materials.find(
      material => material.name === product_name,
    );
    if (!materialToReturn) {
      throw new AppError(
        `Material Retornado(${product_name}) não existe na serviceOrder: ${serviceOrder.number}, materials ${serviceOrder.materials}`,
        500,
      );
    }
    if (materialToReturn!.qty < qty) {
      // TODO Os AppError dentro de um trycatch interno retornam pro front o erro do trycatch externo
      throw new AppError(
        `Você entá tentando retornar mais materiais para o estoque do que a quantidade alocada para essa OS`,
        400,
      );
    }

    const newQty = materialToReturn.qty - qty;

    let returnedMaterial: MaterialProps = {
      name: materialToReturn.name,
      unit_cost: materialToReturn.unit_cost,
      qty: newQty,
      total_cost: materialToReturn.total_cost * newQty,
    };

    let notRetunedMaterials = serviceOrder.materials.filter(
      el => el.name !== returnedMaterial!.name,
    );

    // TODO Falta adicionar esse material retornado no estoque e alterar algumas coisas como: "max_stock_limit" do produto
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
