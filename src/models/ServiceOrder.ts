/* eslint-disable camelcase */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Seller from './Seller';
import Client from './Client';
import Technician from './Technician';

@Entity('service_orders')
class ServiceOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: string;

  @Column({ nullable: true })
  running: boolean;

  @Column({ nullable: true })
  completed: boolean;

  @Column({ nullable: true })
  closed: boolean;

  @ManyToOne(() => Seller, seller => seller.service_orders, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL',
  })
  seller: Seller;

  @ManyToOne(() => Client, client => client.service_orders, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL',
  })
  client: Client;

  @ManyToOne(() => Technician, last_supplier => last_supplier.service_orders, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL',
  })
  technician: Technician;

  @Column()
  man_power_cost: number;

  @Column()
  displacement_cost: number;

  @Column('simple-json')
  materials: {
    name: string;
    qty: number;
    unit_cost: number;
    total_cost: number;
  };

  @Column()
  materials_total_cost: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default ServiceOrder;
