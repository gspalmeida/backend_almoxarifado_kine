/* eslint-disable camelcase */
import { Router } from 'express';
import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import CostCenter from '../models/CostCenter';

import CreateCostCenterService from '../services/CreateCostCenterService';

const costCentersRouter = Router();

costCentersRouter.get('/', async (request, response) => {
  console.log('\n\n\n\n Entrou no get CostCenters');
  const costCentersRepository = getRepository(CostCenter);
  try {
    const costCenters = await costCentersRepository.find();
    console.log(costCenters);

    return response.json(costCenters);
  } catch (error) {
    throw new AppError('Nenhum Centro de Custo encontrado', 500);
  }
});

costCentersRouter.post('/', async (request, response) => {
  const { name } = request.body;

  const createCostCenter = new CreateCostCenterService();

  const costCenter = await createCostCenter.execute({
    name,
  });

  return response.json(costCenter);
});

export default costCentersRouter;
