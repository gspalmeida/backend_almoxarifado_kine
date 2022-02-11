/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import Client from '../models/Client';
import AppError from '../errors/AppError';

interface Request {
  id: Client['id'];
  name: Client['name'];
}
class UpdateClientService {
  public async execute({ id, name }: Request): Promise<Client> {
    try {
      const clientRepository = getRepository(Client);
      const clientToUpdate = await clientRepository.findOneOrFail({
        where: { id },
      });

      if (!clientToUpdate) {
        throw new AppError('Cliente não encontrado');
      }
      await clientRepository.update(
        { id },
        {
          name,
        },
      );

      const updatedClient = await clientRepository.findOneOrFail({
        where: { id },
      });

      return updatedClient;
    } catch (error) {
      console.log('Falha ao atualizar cliente', error);

      throw new AppError(
        `Erro ao atualizar cliente: O id: ${id} não foi encontrado na base de dados; Erro: ${error}`,
        400,
      );
    }
  }
}
export default UpdateClientService;
