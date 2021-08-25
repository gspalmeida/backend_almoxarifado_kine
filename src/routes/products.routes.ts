/* eslint-disable camelcase */
import { Router } from 'express';
import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Product from '../models/Product';
import { RequestCreateUser } from '../services/CreateProductService';

import CreateProductService from '../services/CreateProductService';

const productsRouter = Router();

productsRouter.post('/', async (request, response) => {
  console.log('Entrou no post products');

  let {
    name,
    description,
    unit_cost,
    qty_ordered,
    qty_last_order,
    qty_stocked,
    max_stock_limit,
    costCenterId,
    lastSupplierId,
    unitMeasureId,
    totalPurchaseAmount,
  } = request.body as RequestCreateUser;

  console.log('\n\n\n request.body', request.body);

  const createProduct = new CreateProductService();
  console.log('antes do await');

  const product = await createProduct.execute({
    name,
    description,
    unit_cost,
    qty_ordered,
    qty_last_order,
    qty_stocked,
    max_stock_limit,
    costCenterId,
    lastSupplierId,
    unitMeasureId,
    totalPurchaseAmount,
  });

  console.log('depois do await');

  return response.json(product);
});

productsRouter.get('/', async (request, response) => {
  console.log('\n\n\n\n Entrou no get Products');
  const productsRepository = getRepository(Product);
  try {
    const products = await productsRepository.find();
    console.log(products);

    return response.json(products);
  } catch (error) {
    throw new AppError('Nenhum produto encontrado', 500);
  }
});

export default productsRouter;
