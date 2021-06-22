import { Router } from 'express';
import { getRepository } from 'typeorm';
import moment from 'moment';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import FinancialMovement from '../models/FinancialMovement';
import User from '../models/User';

import CreateFinancialMovementService from '../services/CreateFinancialMovementService';
import UpdateFinancialMovementService from '../services/UpdateFinancialMovementService';

const movementsRouter = Router();

movementsRouter.get('/', ensureAuthenticated, async (request, response) => {
  let financialMovements = [];
  let parsedStartFilter = '';
  let parsedEndFilter = '';
  let parsedMovementDate = '';
  const financialMovementRepository = getRepository(FinancialMovement);

  const { startDate, endDate } = request.query;

  financialMovements = await financialMovementRepository.find({
    where: { user_id: request.user.id },
    relations: ['category'],
  });

  if (startDate && endDate) {
    parsedStartFilter = String(startDate);
    parsedStartFilter = parsedStartFilter.split('/').reverse().join('-');
    parsedStartFilter = moment(parsedStartFilter).format('YYYYMMDD');

    parsedEndFilter = String(endDate);
    parsedEndFilter = parsedEndFilter.split('/').reverse().join('-');
    parsedEndFilter = moment(parsedEndFilter).format('YYYYMMDD');

    financialMovements = financialMovements.filter(movement => {
      parsedMovementDate = moment(
        movement.movement_date.split('/').reverse().join('-'),
      ).format('YYYYMMDD');
      if (
        Number(moment(parsedMovementDate).format('YYYYMMDD')) >=
          Number(parsedStartFilter) &&
        Number(moment(parsedMovementDate).format('YYYYMMDD')) <=
          Number(parsedEndFilter)
      ) {
        return true;
      }
      return false;
    });
  }
  return response.json(financialMovements);
});

movementsRouter.post('/', ensureAuthenticated, async (request, response) => {
  const userRepository = getRepository(User);
  const { category, description, value, date, isMoneyIn } = request.body;
  const createFinancialMovement = new CreateFinancialMovementService();

  const financialMovement = await createFinancialMovement.execute({
    userId: request.user.id,
    category,
    description,
    value,
    date,
    isMoneyIn,
  });
  const userData = await userRepository.findOneOrFail({
    where: { id: request.user.id },
  });
  const { walletBalance: oldWalletBalance } = userData;
  let walletBalance = 0;
  if (isMoneyIn === true) {
    walletBalance = parseFloat(oldWalletBalance) + parseFloat(value);
  } else {
    walletBalance = parseFloat(oldWalletBalance) - parseFloat(value);
  }
  const newWalletBalance = walletBalance.toString();

  await userRepository.update(
    { id: request.user.id },
    {
      walletBalance: newWalletBalance,
    },
  );

  return response.json(financialMovement);
});

movementsRouter.put('/:id', ensureAuthenticated, async (request, response) => {
  const { category, description, value, date, isMoneyIn } = request.body;
  const { id } = request.params;

  const updateFinancialMovement = new UpdateFinancialMovementService();

  const financialMovement = await updateFinancialMovement.execute({
    id,
    category,
    description,
    value,
    date,
    isMoneyIn,
  });

  return response.json(financialMovement);
});

movementsRouter.delete(
  '/:id',
  ensureAuthenticated,
  async (request, response) => {
    const { id } = request.params;
    const financialMovementRepository = getRepository(FinancialMovement);

    await financialMovementRepository.delete(id);
    return response.sendStatus(200);
  },
);

export default movementsRouter;
