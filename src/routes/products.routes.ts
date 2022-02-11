/* eslint-disable camelcase */
import { Router } from 'express';
import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Product from '../models/Product';
import { RequestCreateProduct } from '../services/CreateProductService';

import CreateProductService from '../services/CreateProductService';

const productsRouter = Router();

productsRouter.post('/', async (request, response) => {
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
  } = request.body as RequestCreateProduct;

  const createProduct = new CreateProductService();

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

  return response.json(product);
});

productsRouter.get('/', async (request, response) => {
  const nameFilter = request.query.name;
  const productsRepository = getRepository(Product);
  let products: Product[] = [];
  try {
    if (nameFilter) {
      const findProduct = await productsRepository.findOne({
        where: { name: nameFilter },
      });
      if (findProduct) {
        products.push(findProduct);
      }
    } else {
      const findProducts = await productsRepository.find();
      products = findProducts;
    }

    return response.json(products);
  } catch (error) {
    if (nameFilter) {
      throw new AppError(
        `Nenhum produto encontrado com name=${nameFilter}. Erro: ${error}`,
        500,
      );
    } else {
      throw new AppError('Nenhum produto encontrado', 500);
    }
  }
});

export default productsRouter;
