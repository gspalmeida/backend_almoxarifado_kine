/* import { EntityRepository, Repository } from 'typeorm';
Importar o Model que irá criar o método
import Caregiver from '../models/Caregiver';

@EntityRepository(Caregiver)
class CaregiverRepository extends Repository<Caregiver> {

    Criação do Método Customizado de Exemplo (que retornaria as notificações
    não lidas dos ageds cuidados por esse caregiver);

    Esse metodo receberá "anyParameter: boolean" que terá que ser passado lá
    nos services que forem chamar ele

  public async findAgedsUnreadNotifications(
    anyParameter: boolean,
  ): Promise<Caregiver | null> {
    const agedIds = await this.findOne({
      where: { anyParameter },
    });

    return agedIds || null;
  }
}

  O repositório customizado será importado no service que o utilizar com o
  "getCustomRepositoy(CaregiverRepository)" do typeOrm, permitindo ele usar
  todos os operadores de dados do typeOrm + o "findAgedsUnreadNotification"
  aqui criado


export default CaregiverRepository;
*/
