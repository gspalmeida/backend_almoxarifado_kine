/* eslint-disable camelcase */
import { Router } from 'express';
import AppError from '../errors/AppError';

import UpdateServiceOrderMaterialService from '../services/UpdateServiceOrderMaterialService';

const addMaterialRouter = Router();

// TODO Migrar essa rota para dentro de /serviceOrders/:serviceOrderId/addMaterial
addMaterialRouter.post('/:id', async (request, response) => {
  const { serviceOrderId } = request.params;

  const { product_id, qty } = request.body;

  const pushNewMaterial = new UpdateServiceOrderMaterialService();
  try {
    const serviceOrder = await pushNewMaterial.execute({
      serviceOrderId,
      product_id,
      qty,
    });
    return response.json(serviceOrder);
  } catch (error) {
    throw new AppError(
      `Campos obrigatórios: serviceOrderId:${serviceOrderId}, product_id:${product_id}, qty:${qty}`,
      500,
    );
  }
});

export default addMaterialRouter;
