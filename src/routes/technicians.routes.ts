/* eslint-disable camelcase */
import { Router } from 'express';
import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Technician from '../models/Technician';

import CreateTechnicianService from '../services/CreateTechnicianService';

const techniciansRouter = Router();

techniciansRouter.get('/', async (request, response) => {
  console.log('\n\n\n\n Entrou no get technicians');
  const techniciansRepository = getRepository(Technician);
  try {
    const technicians = await techniciansRepository.find();
    console.log(technicians);

    return response.json(technicians);
  } catch (error) {
    throw new AppError('Nenhum Técnico encontrado', 500);
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

export default techniciansRouter;
