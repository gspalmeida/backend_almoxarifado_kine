/* eslint-disable camelcase */
import { Router } from 'express';
import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import ServiceOrder from '../models/ServiceOrder';
import { RequestCreateServiceOrder } from '../services/CreateServiceOrderService';
import ServiceOrderReturnMaterialService from '../services/ServiceOrderReturnMaterialService';

import CreateServiceOrder from '../services/CreateServiceOrderService';
import AlterProductQtyStockedService from '../services/AlterProductQtyStockedService';

const serviceOrdersRouter = Router();

serviceOrdersRouter.post('/', async (request, response) => {
  console.log('Entrou no POST /serviceOrders');

  const {
    number,
    running,
    completed,
    closed,
    man_power_cost,
    displacement_cost,
    materials,
    materials_total_cost,
    sellerId,
    clientId,
    technicianId,
  } = request.body as RequestCreateServiceOrder;

  const createServiceOrder = new CreateServiceOrder();

  const serviceOrder = await createServiceOrder.execute({
    number,
    running,
    completed,
    closed,
    man_power_cost,
    displacement_cost,
    materials,
    materials_total_cost,
    sellerId,
    clientId,
    technicianId,
  });

  return response.json(serviceOrder);
});

serviceOrdersRouter.get('/', async (request, response) => {
  console.log('\n\n\n\n Entrou no GET /serviceOrders');

  const numberFilter = request.query.number;

  const serviceOrdersRepository = getRepository(ServiceOrder);

  let serviceOrders: ServiceOrder[] = [];

  try {
    if (numberFilter) {
      const findProduct = await serviceOrdersRepository.findOne({
        where: { number: numberFilter },
      });
      return response.json(findProduct);
    } else {
      const findProducts = await serviceOrdersRepository.find();
      return response.json(findProducts);
    }
  } catch (error) {
    throw new AppError('Nenhuma ordem de serviço encontrada', 404);
  }
});

serviceOrdersRouter.get('/:id', async (request, response) => {
  console.log('\n\n\n\n Entrou no GET serviceOrders/:id');

  const { id } = request.params;

  const serviceOrdersRepository = getRepository(ServiceOrder);
  try {
    const serviceOrder = await serviceOrdersRepository.findOne({
      where: { id },
    });
    console.log(serviceOrder);

    return response.json(serviceOrder);
  } catch (error) {
    throw new AppError('Ordem de serviço não encontrada', 404);
  }
});

serviceOrdersRouter.patch('/open/:id', async (request, response) => {
  console.log('\n\n\n\n Entrou no GET serviceOrders/open/:id');

  const { id } = request.params;

  const serviceOrdersRepository = getRepository(ServiceOrder);
  try {
    await serviceOrdersRepository.update(id, {
      running: true,
      completed: false,
      closed: false,
    });
    const serviceOrder = await serviceOrdersRepository.findOne(id);
    console.log(serviceOrder);

    return response.json(serviceOrder);
  } catch (error) {
    throw new AppError('Ordem de serviço não encontrada', 404);
  }
});

serviceOrdersRouter.patch('/close/:id', async (request, response) => {
  console.log('\n\n\n\n Entrou no GET serviceOrders/close/:id');

  const { id } = request.params;

  const serviceOrdersRepository = getRepository(ServiceOrder);
  try {
    await serviceOrdersRepository.update(id, {
      running: false,
      completed: true,
      closed: false,
    });
    const serviceOrder = await serviceOrdersRepository.findOne(id);
    console.log(serviceOrder);

    return response.json(serviceOrder);
  } catch (error) {
    throw new AppError('Ordem de serviço não encontrada', 404);
  }
});

serviceOrdersRouter.patch('/terminate/:id', async (request, response) => {
  const serviceOrdersRepository = getRepository(ServiceOrder);

  const { id } = request.params;
  const { displacement_cost, man_power_cost } = request.body;

  try {
    const serviceOrder = await serviceOrdersRepository.findOneOrFail(id);
    const newTotalCost =
      serviceOrder.total_cost + displacement_cost + man_power_cost;

    const newMaterialsTotalCost = serviceOrder.materials
      .reduce(function (materialsTotalCost, material) {
        return materialsTotalCost + material.total_cost;
      }, 0)
      .toString();

    await serviceOrdersRepository.update(id, {
      displacement_cost,
      man_power_cost,
      running: false,
      completed: false,
      closed: true,
      total_cost: newTotalCost,
      materials_total_cost: newMaterialsTotalCost,
    });
    const updatedServiceOrder = await serviceOrdersRepository.findOne(id);
    return response.json(updatedServiceOrder);
  } catch (error) {
    console.log('erro ao encerrar');
    console.log(error);

    throw new AppError('Ordem de serviço não encontrada', 404);
  }
});

serviceOrdersRouter.post(
  '/returnMaterial/:serviceOrderId',
  async (request, response) => {
    console.log('\n\n Entrou no POST returnMaterial/:serviceOrderId');

    const { serviceOrderId } = request.params;

    const { product_name: productName, qty } = request.body;

    const returnMaterialService = new ServiceOrderReturnMaterialService();
    const addProductToInventoryService = new AlterProductQtyStockedService();

    try {
      const updatedServiceOrder = await returnMaterialService.execute({
        serviceOrderId,
        returnedProductName: productName,
        qty: Number(qty),
      });
      const updatedProduct = await addProductToInventoryService.execute({
        name: productName,
        changeQty: qty,
        actionType: 'addition',
      });
      console.log('\n\n New product state:\n', updatedProduct);

      return response.json(updatedServiceOrder);
    } catch (error) {
      console.log(
        `Erro ao retornar material pro estoque: ${error!.message}`,
        error,
      );

      throw new AppError(
        `Erro ao retornar material pro estoque: ${error!.message}`,
        500,
      );
    }
  },
);

export default serviceOrdersRouter;
