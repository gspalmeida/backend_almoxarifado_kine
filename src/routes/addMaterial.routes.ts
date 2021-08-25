/* eslint-disable camelcase */
import { Router } from 'express';
import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import ServiceOrder from '../models/ServiceOrder';
import { RequestCreateServiceOrder } from '../services/CreateServiceOrderService';

import AddMaterialServiceOrder from '../services/AddMaterialService';

const addMaterialRouter = Router();

addMaterialRouter.post('/:id', async (request, response) => {
  console.log('Entrou no post addMaterial');

  const { id } = request.params;

  const { product_id, qty } = request.body;

  const addMaterialServiceOrder = new AddMaterialServiceOrder();

  const serviceOrder = await addMaterialServiceOrder.execute({
    id,
    product_id,
    qty,
  });

  console.log('depois do await');

  return response.json(serviceOrder);
});

export default addMaterialRouter;
