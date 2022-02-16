/* eslint-disable camelcase */
import { Router } from 'express';
import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Product from '../models/Product';
import { RequestCreateProduct } from '../services/CreateProductService';

import CreateProductService from '../services/CreateProductService';
import DeleteProductService from '../services/DeleteProductService';
import UpdateProductService from '../services/UpdateProductService';

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

productsRouter.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const deleteProduct = new DeleteProductService();
    const deletedProduct = await deleteProduct.execute({
      id,
    });

    return response.json(deletedProduct);
  } catch (error) {
    throw new AppError(`Falha ao deletar produto, erro: ${error}`, 500);
  }
});

productsRouter.patch('/', async (request, response) => {
  const {
    id,
    newName,
    newDescription,
    newUnitCost,
    newQuantityInStock,
    newMaxStockLimit,
  } = request.body;
  try {
    const updateProduct = new UpdateProductService();
    const updatedProduct = await updateProduct.execute({
      id,
      name: newName,
      description: newDescription,
      unit_cost: newUnitCost,
      qty_stocked: newQuantityInStock,
      max_stock_limit: newMaxStockLimit,
    });

    return response.json(updatedProduct);
  } catch (error) {
    throw new AppError(
      `Falha ao atualizad dados do produto, erro: ${error}`,
      500,
    );
  }
});

export default productsRouter;
