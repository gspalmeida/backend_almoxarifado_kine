/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import ServiceOrder from '../models/ServiceOrder';
import Product from '../models/Product';
import AppError from '../errors/AppError';

interface materialProps {
  serviceOrderId: string;
  product_name: string;
  qty: number;
}

class ReturnMaterialService {
  public async execute({
    serviceOrderId,
    product_name,
    qty,
  }: materialProps): Promise<ServiceOrder> {
    const serviceOrderRepository = getRepository(ServiceOrder);
    console.log('Entrou no service ReturnMaterialService');

    let serviceOrder = await serviceOrderRepository.findOne({
      where: { id: serviceOrderId },
    });

    if (
      serviceOrder &&
      serviceOrder.materials.find(material => material.name === product_name)
    ) {
      if (
        serviceOrder.materials.find(material => material.name === product_name)!
          .qty >= qty
      ) {
        let material = serviceOrder.materials.find(
          material => material.name === product_name,
        );
        material!['qty'] -= qty;

        let materials = serviceOrder.materials.filter(
          el => el.name !== material!.name,
        );

        // TODO Falta adicionar esse material retornado no estoque e alterar algumas coisas como: "max_stock_limit" do produto
        await serviceOrderRepository.update(serviceOrderId, {
          materials: [...materials, material!],
        });
      } else {
        throw new AppError(
          `Você entá tentando retornar mais materiais do que está na Ordem de Serviço`,
          500,
        );
      }
    } else {
      throw new AppError(
        `Campos obrigatórios: serviceOrder: ${serviceOrder}, product_name ${product_name}, qty: ${qty}`,
        500,
      );
    }
    serviceOrder = await serviceOrderRepository.findOneOrFail({
      where: { id: serviceOrderId },
    });
    return serviceOrder;
  }
}
export default ReturnMaterialService;
