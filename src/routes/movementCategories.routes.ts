/* eslint-disable camelcase */
import { Router } from 'express';
import { getRepository } from 'typeorm';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import FinancialMovementCategory from '../models/FinancialMovementCategory';
import CreateFinancialMovementCategoryService from '../services/CreateFinancialMovementCategoryService';
import UpdateFinancialMovementCategoryService from '../services/UpdateFinancialMovementCategoryService';

const movementCategoriesRouter = Router();

movementCategoriesRouter.get(
  '/',
  ensureAuthenticated,
  async (request, response) => {
    const financialMovementCategoryRepository = getRepository(
      FinancialMovementCategory,
    );

    const movementCategory = await financialMovementCategoryRepository.find();
    return response.json(movementCategory);
  },
);

movementCategoriesRouter.post(
  '/',
  ensureAuthenticated,
  async (request, response) => {
    const { categoryName } = request.body;
    const createFinancialMovementCategory = new CreateFinancialMovementCategoryService();

    const financialMovementCategory = await createFinancialMovementCategory.execute(
      {
        categoryName,
      },
    );

    return response.json(financialMovementCategory);
  },
);

movementCategoriesRouter.put(
  '/:id',
  ensureAuthenticated,
  async (request, response) => {
    const { id } = request.params;
    const { categoryName } = request.body;

    const updateServiceType = new UpdateFinancialMovementCategoryService();

    const service = await updateServiceType.execute({
      id,
      categoryName,
    });

    return response.json(service);
  },
);

movementCategoriesRouter.delete(
  '/:id',
  ensureAuthenticated,
  async (request, response) => {
    const { id } = request.params;
    const serviceTypeRepository = getRepository(FinancialMovementCategory);

    await serviceTypeRepository.delete(id);
    response.sendStatus(200);
  },
);

export default movementCategoriesRouter;
