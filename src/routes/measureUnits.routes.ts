/* eslint-disable camelcase */
import { Router } from 'express';
import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import MeasureUnit from '../models/MeasureUnit';

import CreateMeasureUnitService from '../services/CreateMeasureUnitService';

const measureUnits = Router();

measureUnits.get('/', async (request, response) => {
  console.log('\n\n\n\n Entrou no get MeasureUnits');
  const measureUnitsRepository = getRepository(MeasureUnit);
  try {
    const measureUnits = await measureUnitsRepository.find();
    console.log(measureUnits);

    return response.json(measureUnits);
  } catch (error) {
    throw new AppError('Nenhuma Unidade de Medida encontrada', 500);
  }
});

measureUnits.post('/', async (request, response) => {
  const { name } = request.body;

  const createMeasureUnit = new CreateMeasureUnitService();

  const measureUnit = await createMeasureUnit.execute({
    name,
  });

  return response.json(measureUnit);
});

export default measureUnits;
