/* eslint-disable camelcase */
import { Router } from 'express';
import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Technician from '../models/Technician';

import CreateTechnicianService from '../services/CreateTechnicianService';
import DeleteTechnicianService from '../services/DeleteTechnicianService';
import UpdateTechnicianService from '../services/UpdateTechnicianService';

const techniciansRouter = Router();

techniciansRouter.get('/', async (request, response) => {
  const techniciansRepository = getRepository(Technician);
  try {
    const technicians = await techniciansRepository.find();

    technicians.splice(
      technicians.findIndex(
        technician => technician.name === 'Técnico removido do sistema',
      ),
      1,
    ); //Remove do array o filler de Fornecedores deletados

    return response.json(technicians);
  } catch (error) {
    throw new AppError('Nenhum técnico encontrado', 500);
  }
});

techniciansRouter.post('/', async (request, response) => {
  const { name } = request.body;

  const createTechnician = new CreateTechnicianService();

  const technician = await createTechnician.execute({
    name,
  });

  return response.json(technician);
});

techniciansRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTechnician = new DeleteTechnicianService();
  const deletedTechnician = await deleteTechnician.execute({
    id,
  });

  return response.json(deletedTechnician);
});

techniciansRouter.patch('/', async (request, response) => {
  const { id, newName } = request.body;

  const updateTechnician = new UpdateTechnicianService();
  const updatedTechnician = await updateTechnician.execute({
    id,
    name: newName,
  });

  return response.json(updatedTechnician);
});

export default techniciansRouter;
