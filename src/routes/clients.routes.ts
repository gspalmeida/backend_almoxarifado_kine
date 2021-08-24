/* eslint-disable camelcase */
import { Router } from 'express';
import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Client from '../models/Client';

import CreateClientService from '../services/CreateClientService';

const clientsRouter = Router();

clientsRouter.get('/', async (request, response) => {
  console.log('\n\n\n\n Entrou no get clients');
  const clientsRepository = getRepository(Client);
  try {
    const clients = await clientsRepository.find();
    console.log(clients);

    return response.json(clients);
  } catch (error) {
    throw new AppError('Nenhum Técnico encontrado', 500);
  }
});

clientsRouter.post('/', async (request, response) => {
  const { name } = request.body;

  const createClient = new CreateClientService();

  const client = await createClient.execute({
    name,
  });

  return response.json(client);
});

export default clientsRouter;
