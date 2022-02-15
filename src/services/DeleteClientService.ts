/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import Client from '../models/Client';
import AppError from '../errors/AppError';
import CreateClientService from '../services/CreateClientService';
import UpdateServiceOrdersClientToFillerService from '../services/UpdateServiceOrdersClientToFillerService';

interface Request {
  id: Client['id'];
}
class DeleteClientService {
  public async execute({ id }: Request): Promise<Client> {
    try {
      const clientRepository = getRepository(Client);
      const clientToRemove = await clientRepository.findOneOrFail({
        where: { id },
      });

      let fillerClient = await clientRepository.findOne({
        where: { name: 'Cliente removido do sistema' },
      });
      if (!fillerClient) {
        const createFiller = new CreateClientService();

        fillerClient = await createFiller.execute({
          name: 'Cliente removido do sistema',
        });
      }
      const changeClientToFiller = new UpdateServiceOrdersClientToFillerService();
      await changeClientToFiller.execute({
        clientId: id,
        fillerId: fillerClient.id,
      });

      await clientRepository.remove(clientToRemove);

      return fillerClient;
    } catch (error) {
      console.log('Falha ao remover cliente', error);

      throw new AppError(
        `Erro ao remover cliente: O id: ${id} não existe`,
        400,
      );
    }
  }
}
export default DeleteClientService;
