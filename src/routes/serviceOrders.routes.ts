/* eslint-disable camelcase */
import { Router } from 'express';
import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import ServiceOrder from '../models/ServiceOrder';
import { RequestCreateServiceOrder } from '../services/CreateServiceOrderService';

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
  console.log('\n\n\n\n Entrou no get ServiceOrders');

  const { id } = request.params;

  const serviceOrdersRepository = getRepository(ServiceOrder);
  try {
    const serviceOrders = await serviceOrdersRepository.find({ where: { id } });
    console.log(serviceOrders);

    return response.json(serviceOrders);
  } catch (error) {
    throw new AppError('Nenhum produto encontrado', 500);
  }
});

export default serviceOrdersRouter;
