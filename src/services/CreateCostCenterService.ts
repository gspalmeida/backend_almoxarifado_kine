/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import CostCenter from '../models/CostCenter';
import AppError from '../errors/AppError';

interface Request {
  name: string;
}
class CreateCostCenterService {
  public async execute({ name }: Request): Promise<CostCenter> {
    const costCenterRepository = getRepository(CostCenter);

    const checkCostCenterExists = await costCenterRepository.findOne({
      where: { name },
    });

    if (checkCostCenterExists) {
      return checkCostCenterExists;
    }

    const costCenter = costCenterRepository.create({
      name,
    });

    await costCenterRepository.save(costCenter);

    return costCenter;
  }
}
export default CreateCostCenterService;
