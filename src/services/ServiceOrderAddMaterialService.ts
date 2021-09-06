/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import ServiceOrder from '../models/ServiceOrder';
import Product from '../models/Product';
import AppError from '../errors/AppError';
import AlterServiceOrderTotalCostService from './AlterServiceOrderTotalCostService';

interface AddMaterialRequestProps {
  serviceOrderId: string;
  productId: string;
  qty: number;
}

class ServiceOrderAddMaterialService {
  public async execute({
    serviceOrderId,
    qty,
    productId,
  }: AddMaterialRequestProps): Promise<ServiceOrder> {
    const serviceOrdersRepository = getRepository(ServiceOrder);
    const productsRepository = getRepository(Product);
    console.log('Entrou no ServiceOrderAddMaterialService');

    let serviceOrder = await serviceOrdersRepository.findOne({
      where: { id: serviceOrderId },
    });

    let productInStock = await productsRepository.findOne({
      where: { id: productId },
    });

    if (!productInStock) {
      console.log(`Produto não encontrado no estoque: productId:${productId}`);
      throw new AppError(
        `Produto não encontrado no estoque: productId:${productId}`,
        500,
      );
    }
    if (productInStock.qty_stocked < qty) {
      console.log(
        `Você entá tentando adicionar mais materiais na OS do que a quantidade disponível em estoque. \n
         Estoque atual:${productInStock.qty_stocked} \n 
         Quantidade Informada: ${qty}`,
      );
      throw new AppError(
        `Você entá tentando adicionar mais materiais na OS do que a quantidade disponível em estoque`,
        400,
      );
    }
    if (!serviceOrder) {
      console.log(
        `Ordem de serviço não encontrada: serviceOrderId:${serviceOrderId}`,
      );
      throw new AppError(
        `Ordem de serviço não encontrada: serviceOrderId:${serviceOrderId}`,
        500,
      );
    }
    const materialTotalCost = Number(productInStock?.unit_cost) * qty;
    console.log(materialTotalCost);
    if (!materialTotalCost) {
      console.log(
        `Falha ao calcular o custo total do material alocado:\n
         productInStock?.unit_cost:${productInStock?.unit_cost}\n 
         qty: ${qty}`,
      );
      throw new AppError(
        `Falha ao calcular o custo total do material alocado:\n
         productInStock?.unit_cost:${productInStock?.unit_cost}\n 
         qty: ${qty}`,
        500,
      );
    }
    const serviceOrderMaterialAlreadyExists = serviceOrder.materials.find(
      material => material.name === productInStock?.name,
    );

    if (serviceOrderMaterialAlreadyExists) {
      let otherMaterials = serviceOrder.materials.filter(
        el => el.name !== serviceOrderMaterialAlreadyExists.name,
      );

      const newQty = serviceOrderMaterialAlreadyExists.qty + qty;
      const newTotalCost = newQty * Number(productInStock.unit_cost);
      const updatedMaterial = {
        name: productInStock!.name,
        qty: newQty,
        unit_cost: productInStock!.unit_cost,
        total_cost: newTotalCost,
      };

      const updatedServiceOrder = await serviceOrdersRepository.update(
        serviceOrderId,
        {
          materials: [...otherMaterials, updatedMaterial],
        },
      );
      console.log(`After update an old material: ${updatedServiceOrder}`);
      const serviceOrderTotalCostAfterUpdateMaterials =
        newTotalCost - serviceOrderMaterialAlreadyExists.total_cost;
      const updateServiceOrderTotalCost = new AlterServiceOrderTotalCostService();
      const updatedTotalCost = await updateServiceOrderTotalCost.execute({
        serviceOrderId,
        value: serviceOrderTotalCostAfterUpdateMaterials,
        actionType: 'addition',
      });
      console.log(`After update serviceOrder.totalCost: ${updatedTotalCost}`);

      serviceOrder = await serviceOrdersRepository.findOneOrFail({
        where: { id: serviceOrderId },
      });
      return serviceOrder;
    }
    const updatedServiceOrder = await serviceOrdersRepository.update(
      serviceOrderId,
      {
        materials: [
          ...serviceOrder!.materials,
          {
            name: productInStock!.name,
            qty,
            unit_cost: productInStock!.unit_cost,
            total_cost: materialTotalCost,
          },
        ],
      },
    );
    console.log(`After add new material: ${updatedServiceOrder}`);
    const updateServiceOrderTotalCost = new AlterServiceOrderTotalCostService();
    const updatedTotalCost = await updateServiceOrderTotalCost.execute({
      serviceOrderId,
      value: materialTotalCost,
      actionType: 'addition',
    });
    console.log(`After update serviceOrder.totalCost: ${updatedTotalCost}`);
    serviceOrder = await serviceOrdersRepository.findOneOrFail({
      where: { id: serviceOrderId },
    });
    return serviceOrder;
  }
}
export default ServiceOrderAddMaterialService;