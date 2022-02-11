/* eslint-disable camelcase */
import { Router } from 'express';
import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Client from '../models/Client';

import CreateClientService from '../services/CreateClientService';
import DeleteClientService from '../services/DeleteClientService';
import UpdateClientService from '../services/UpdateClientService';

const clientsRouter = Router();

clientsRouter.get('/', async (request, response) => {
  const clientsRepository = getRepository(Client);
  try {
    const clients = await clientsRepository.find();

    clients.splice(
      clients.findIndex(
        client => client.name === 'Cliente removido do sistema',
      ),
      1,
    ); //Remove do array o filler de Clientes deletados

    return response.json(clients);
  } catch (error) {
    throw new AppError('Nenhum cliente encontrado', 500);
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

clientsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteClient = new DeleteClientService();
  const deletedClient = await deleteClient.execute({
    id,
  });

  return response.json(deletedClient);
});

clientsRouter.patch('/', async (request, response) => {
  const { id, newName } = request.body;

  const updateClient = new UpdateClientService();
  const updatedClient = await updateClient.execute({
    id,
    name: newName,
  });

  return response.json(updatedClient);
});

export default clientsRouter;
