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
  const serviceOrdersRepository = getRepository(ServiceOrder);
  try {
    const serviceOrders = await serviceOrdersRepository.find();

    return response.json(serviceOrders);
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
  console.log('\n\n\n\n Entrou no GET serviceOrders/terminate/:id');
  const serviceOrdersRepository = getRepository(ServiceOrder);

  const { id } = request.params;
  const { displacement_cost, man_power_cost } = request.body;

  try {
    await serviceOrdersRepository.update(id, {
      displacement_cost,
      man_power_cost,
      running: false,
      completed: false,
      closed: true,
    });
    const serviceOrder = await serviceOrdersRepository.findOne(id);
    console.log(serviceOrder);

    return response.json(serviceOrder);
  } catch (error) {
    throw new AppError('Ordem de serviço não encontrada', 404);
  }
});

serviceOrdersRouter.post(
  '/returnMaterial/:serviceOrderId',
  async (request, response) => {
    console.log('\n\n\n\n Entrou no GET returnMaterial/:id');

    const { serviceOrderId } = request.params;

    const { product_name, qty } = request.body;

    const returnMaterial = new ServiceOrderReturnMaterialService();
    const addProductToInventory = new AlterProductQtyStockedService();

    try {
      const serviceOrder = await returnMaterial.execute({
        serviceOrderId,
        product_name,
        qty: Number(qty),
      });
      const newProductState = await addProductToInventory.execute({
        name: product_name,
        changeQty: qty,
        actionType: 'addition',
      });
      console.log(newProductState);

      return response.json(serviceOrder);
    } catch (error) {
      console.log(error);

      throw new AppError(
        `Erro ao alocar retornar material pro estoque => serviceOrderId:${serviceOrderId}, product_name:${product_name}, qty:${qty}`,
        500,
      );
    }
  },
);

export default serviceOrdersRouter;
