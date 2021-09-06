/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import ServiceOrder from '../models/ServiceOrder';

export interface RequestAlterServiceOrderTotalCost {
  serviceOrderId?: ServiceOrder['id'];
  actionType: 'subtraction' | 'addition';
  value: number;
}
class AlterServiceOrderTotalCostService {
  public async execute({
    serviceOrderId,
    actionType,
    value,
  }: RequestAlterServiceOrderTotalCost): Promise<ServiceOrder['total_cost']> {
    try {
      const serviceOrderRepository = getRepository(ServiceOrder);
      let newTotalCost = -1;

      const serviceOrder = await serviceOrderRepository.findOne({
        where: { id: serviceOrderId },
      });

      if (!serviceOrder) {
        console.log(
          `Nenhuma ordem de serviço encontrada: \n serviceOrderId: ${serviceOrderId}`,
        );
        throw new AppError(
          `Nenhuma ordem de serviço encontrada: \n serviceOrderId: ${serviceOrderId}`,
          404,
        );
      }

      if (actionType === 'subtraction') {
        newTotalCost = serviceOrder.total_cost - value;
        if (newTotalCost < 0) {
          throw new AppError(
            'O valor a ser deduzido da OS é maior que o seu custo total atual',
            400,
          );
        }
      }
      if (actionType === 'addition') {
        newTotalCost = serviceOrder.total_cost + value;
      }
      const updatedServiceOrder = await serviceOrderRepository.update(
        serviceOrder.id,
        {
          total_cost: newTotalCost,
        },
      );
      console.log(
        `After update serviceOrder.totalCost: ${updatedServiceOrder}`,
      );

      return newTotalCost;
    } catch (error) {
      console.log(
        `Erro ao atualizar custo total da ordem de serviço. \n id: ${serviceOrderId} \n actionType:${actionType}\n\n`,
      );
      console.log(error);

      throw new AppError(
        `Erro ao atualizar custo total da ordem de serviço. \n id: ${serviceOrderId} \n actionType:${actionType}`,
        500,
      );
    }
  }
}
export default AlterServiceOrderTotalCostService;
