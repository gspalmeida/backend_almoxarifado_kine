/* eslint-disable camelcase */
import { Router } from 'express';
import AppError from '../errors/AppError';

import ServiceOrderAddMaterialService from '../services/ServiceOrderAddMaterialService';
import AlterProductQtyStockedService from '../services/AlterProductQtyStockedService';

const addMaterialRouter = Router();

// TODO Migrar essa rota para dentro de /serviceOrders/:serviceOrderId/addMaterial
addMaterialRouter.post('/:serviceOrderId', async (request, response) => {
  const { serviceOrderId } = request.params;

  const { product_id, qty } = request.body;

  const addMaterialToServiceOrder = new ServiceOrderAddMaterialService();
  const removeProductFromInventory = new AlterProductQtyStockedService();
  try {
    const serviceOrder = await addMaterialToServiceOrder.execute({
      serviceOrderId,
      product_id,
      qty,
    });
    const newProductState = await removeProductFromInventory.execute({
      id: product_id,
      changeQty: qty,
      actionType: 'subtraction',
    });

    return response.json(serviceOrder);
  } catch (error) {
    throw new AppError(
      `Erro ao alocar material na OS => serviceOrderId:${serviceOrderId}, product_id:${product_id}, qty:${qty}`,
      500,
    );
  }
});

export default addMaterialRouter;
