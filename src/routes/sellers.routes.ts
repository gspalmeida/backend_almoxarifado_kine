/* eslint-disable camelcase */
import { Router } from 'express';
import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Seller from '../models/Seller';

import CreateSellerService from '../services/CreateSellerService';
import DeleteSellerService from '../services/DeleteSellerService';
import UpdateSellerService from '../services/UpdateSellerService';

const sellersRouter = Router();

sellersRouter.get('/', async (request, response) => {
  const sellersRepository = getRepository(Seller);
  try {
    const sellers = await sellersRepository.find();

    sellers.splice(
      sellers.findIndex(
        seller => seller.name === 'Vendedor removido do sistema',
      ),
      1,
    ); //Remove do array o filler de Vendedores deletados

    return response.json(sellers);
  } catch (error) {
    throw new AppError('Nenhum vendedor encontrado', 500);
  }
});

sellersRouter.post('/', async (request, response) => {
  const { name } = request.body;

  const createSeller = new CreateSellerService();
  const seller = await createSeller.execute({
    name,
  });

  return response.json(seller);
});

sellersRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteSeller = new DeleteSellerService();
  const deletedSeller = await deleteSeller.execute({
    id,
  });

  return response.json(deletedSeller);
});

sellersRouter.patch('/', async (request, response) => {
  const { id, newName } = request.body;

  const updateSeller = new UpdateSellerService();
  const updatedSeller = await updateSeller.execute({
    id,
    name: newName,
  });

  return response.json(updatedSeller);
});

export default sellersRouter;
