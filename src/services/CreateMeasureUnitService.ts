/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import MeasureUnit from '../models/MeasureUnit';
import AppError from '../errors/AppError';

interface Request {
  name: string;
}
class CreateMeasureUnitService {
  public async execute({ name }: Request): Promise<MeasureUnit> {
    const measureUnitRepository = getRepository(MeasureUnit);

    const checkMeasureUnitExists = await measureUnitRepository.findOne({
      where: { name },
    });

    if (checkMeasureUnitExists) {
      return checkMeasureUnitExists;
    }

    const measureUnit = measureUnitRepository.create({
      name,
    });

    await measureUnitRepository.save(measureUnit);

    return measureUnit;
  }
}
export default CreateMeasureUnitService;
