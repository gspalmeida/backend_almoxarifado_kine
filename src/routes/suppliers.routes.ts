/* eslint-disable camelcase */
import { Router } from 'express';
import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Supplier from '../models/Supplier';

import CreateSupplierService from '../services/CreateSupplierService';
import DeleteSupplierService from '../services/DeleteSupplierService';
import UpdateSupplierService from '../services/UpdateSupplierService';

const suppliersRouter = Router();

suppliersRouter.get('/', async (request, response) => {
  const suppliersRepository = getRepository(Supplier);
  try {
    const suppliers = await suppliersRepository.find();

    suppliers.splice(
      suppliers.findIndex(
        supplier => supplier.name === 'Fornecedor removido do sistema',
      ),
      1,
    ); //Remove do array o filler de Fornecedores deletados

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

suppliersRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteSupplier = new DeleteSupplierService();
  const deletedSupplier = await deleteSupplier.execute({
    id,
  });

  return response.json(deletedSupplier);
});

suppliersRouter.patch('/', async (request, response) => {
  const { id, newName } = request.body;

  const updateSupplier = new UpdateSupplierService();
  const updatedSupplier = await updateSupplier.execute({
    id,
    name: newName,
  });

  return response.json(updatedSupplier);
});

export default suppliersRouter;
