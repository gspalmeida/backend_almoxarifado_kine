/* eslint-disable camelcase */
import { Router } from 'express';
import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Supplier from '../models/Supplier';

import CreateSupplierService from '../services/CreateSupplierService';

const suppliersRouter = Router();

suppliersRouter.get('/', async (request, response) => {
  console.log('\n\n\n\n Entrou no get Suppliers');
  const suppliersRepository = getRepository(Supplier);
  try {
    const suppliers = await suppliersRepository.find();
    console.log(suppliers);

    return response.json(suppliers);
  } catch (error) {
    throw new AppError('Nenhum fornecedor encontrado', 500);
  }
});

suppliersRouter.post('/', async (request, response) => {
  const { name } = request.body;

  const createSupplier = new CreateSupplierService();

  const supplier = await createSupplier.execute({
    name,
  });

  return response.json(supplier);
});

export default suppliersRouter;
