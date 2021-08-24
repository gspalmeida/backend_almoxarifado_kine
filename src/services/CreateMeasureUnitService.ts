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
      throw new AppError(
        'Essa Unidade de Medida já existe (impossível criar 2 com o mesmo nome)',
      );
    }

    const measureUnit = measureUnitRepository.create({
      name,
    });

    await measureUnitRepository.save(measureUnit);

    return measureUnit;
  }
}
export default CreateMeasureUnitService;
