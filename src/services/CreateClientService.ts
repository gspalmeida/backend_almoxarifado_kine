/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import Client from '../models/Client';
import AppError from '../errors/AppError';

interface Request {
  name: string;
}
class CreateClientService {
  public async execute({ name }: Request): Promise<Client> {
    const clientRepository = getRepository(Client);

    const checkClientExists = await clientRepository.findOne({
      where: { name },
    });

    if (checkClientExists) {
      return checkClientExists;
    }

    const client = clientRepository.create({
      name,
    });

    await clientRepository.save(client);

    return client;
  }
}
export default CreateClientService;
