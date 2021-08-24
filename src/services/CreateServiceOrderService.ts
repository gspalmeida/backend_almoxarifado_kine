/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import ServiceOrder from '../models/ServiceOrder';
import AppError from '../errors/AppError';
import Seller from '../models/Seller';
import Client from '../models/Client';
import Technician from '../models/Technician';

interface Materials {
  name: string;
  qty: number;
  unit_cost: number;
  total_cost: number;
}

export interface RequestCreateServiceOrder {
  number: string;
  running: boolean;
  completed: boolean;
  closed: boolean;
  man_power_cost: number;
  displacement_cost: number;
  materials: Materials;
  materials_total_cost: number;
  sellerId: Seller;
  clientId: Client;
  technicianId: Technician;
}
class CreateServiceOrderService {
  public async execute({
    number,
    running,
    completed,
    closed,
    man_power_cost,
    displacement_cost,
    materials,
    materials_total_cost,
    sellerId,
    clientId,
    technicianId,
  }: RequestCreateServiceOrder): Promise<ServiceOrder> {
    const serviceOrderRepository = getRepository(ServiceOrder);
    console.log('Entrou no service de service order');

    const checkServiceOrderExists = await serviceOrderRepository.findOne({
      where: { number },
    });

    if (checkServiceOrderExists) {
      throw new AppError('A OS já existe tem que chamar o update');
    }

    const product = serviceOrderRepository.create({
      number,
      running,
      completed,
      closed,
      man_power_cost,
      displacement_cost,
      materials,
      materials_total_cost,
      seller: sellerId,
      client: clientId,
      technician: technicianId,
    });

    await serviceOrderRepository.save(product);

    return product;
  }
}
export default CreateServiceOrderService;
