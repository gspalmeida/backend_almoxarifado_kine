/* eslint-disable camelcase */
import { Router } from 'express';
import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Seller from '../models/Seller';

import CreateSellerService from '../services/CreateSellerService';

const sellersRouter = Router();

sellersRouter.get('/', async (request, response) => {
  console.log('\n\n\n\n Entrou no get Sellers');
  const sellersRepository = getRepository(Seller);
  try {
    const sellers = await sellersRepository.find();
    console.log(sellers);

    return response.json(sellers);
  } catch (error) {
    throw new AppError('Nenhum Vendedor encontrado', 500);
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

export default sellersRouter;
