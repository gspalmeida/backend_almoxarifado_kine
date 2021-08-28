/* eslint-disable camelcase */
import { Router } from 'express';
import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import ServiceOrder from '../models/ServiceOrder';
import { RequestCreateServiceOrder } from '../services/CreateServiceOrderService';
import ReturnMaterialService from '../services/ReturnMaterialService';

import CreateServiceOrder from '../services/CreateServiceOrderService';

const serviceOrdersRouter = Router();

serviceOrdersRouter.post('/', async (request, response) => {
  console.log('Entrou no post serviceOrders');

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

  console.log('\n\n\n request.body', request.body);

  const createServiceOrder = new CreateServiceOrder();
  console.log('antes do await');

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

  console.log('depois do await');

  return response.json(serviceOrder);
});

serviceOrdersRouter.get('/', async (request, response) => {
  console.log('\n\n\n\n Entrou no get ServiceOrders');
  const serviceOrdersRepository = getRepository(ServiceOrder);
  try {
    const serviceOrders = await serviceOrdersRepository.find();
    console.log(serviceOrders);

    return response.json(serviceOrders);
  } catch (error) {
    throw new AppError('Nenhum produto encontrado', 500);
  }
});

serviceOrdersRouter.get('/:id', async (request, response) => {
  console.log('\n\n\n\n Entrou no GET serviceOrders/:id');

  const { id } = request.params;

  const serviceOrdersRepository = getRepository(ServiceOrder);
  try {
    const serviceOrders = await serviceOrdersRepository.findOne({
      where: { id },
    });
    console.log(serviceOrders);

    return response.json(serviceOrders);
  } catch (error) {
    throw new AppError('Nenhum produto encontrado', 500);
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
    const serviceOrders = await serviceOrdersRepository.findOne(id);
    console.log(serviceOrders);

    return response.json(serviceOrders);
  } catch (error) {
    throw new AppError('Nenhum produto encontrado', 500);
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
    const serviceOrders = await serviceOrdersRepository.findOne(id);
    console.log(serviceOrders);

    return response.json(serviceOrders);
  } catch (error) {
    throw new AppError('Nenhum produto encontrado', 500);
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
    });

    await serviceOrdersRepository.update(id, {
      running: false,
      completed: false,
      closed: true,
    });
    const serviceOrders = await serviceOrdersRepository.findOne(id);
    console.log(serviceOrders);

    return response.json(serviceOrders);
  } catch (error) {
    throw new AppError('Nenhum produto encontrado', 500);
  }
});

serviceOrdersRouter.post(
  '/returnMaterial/:serviceOrderId',
  async (request, response) => {
    console.log('\n\n\n\n Entrou no GET returnMaterial/:id');

    const { serviceOrderId } = request.params;

    const { product_name, qty } = request.body;

    const returnMaterial = new ReturnMaterialService();

    try {
      const serviceOrder = await returnMaterial.execute({
        serviceOrderId,
        product_name,
        qty: Number(qty),
      });
      console.log('Material Retornou ao estoque');
      return response.json(serviceOrder);
    } catch (error) {
      console.log(error);

      throw new AppError(
        `Campos obrigatórios: serviceOrderId:${serviceOrderId}, product_name:${product_name}, qty:${qty}`,
        500,
      );
    }
  },
);

export default serviceOrdersRouter;
