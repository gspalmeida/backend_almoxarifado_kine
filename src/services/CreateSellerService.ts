/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import Seller from '../models/Seller';
import AppError from '../errors/AppError';

interface Request {
  name: string;
}
class CreateSellerService {
  public async execute({ name }: Request): Promise<Seller> {
    const sellerRepository = getRepository(Seller);

    const checkSellerExists = await sellerRepository.findOne({
      where: { name },
    });

    if (checkSellerExists) {
      return checkSellerExists;
    }

    const seller = sellerRepository.create({
      name,
    });

    await sellerRepository.save(seller);

    return seller;
  }
}
export default CreateSellerService;
