/* eslint-disable camelcase */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import UnitOfMeasure from './UnitOfMeasure'
import CostCenter from './CostCenter'
import Supplier from './Supplier'

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  unit_cost: number;

  @Column({ nullable: true })
  unit_last_cost: number;

  @ManyToOne(() => UnitOfMeasure, unit_measure => unit_measure.products, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL'
  })
  unit_measure: UnitOfMeasure;

  @Column()
  qty_ordered: number;

  @Column()
  qty_last_order: number;

  @Column()
  qty_stocked: number;

  @Column()
  qty_stock_limit: number;

  @ManyToOne(() => CostCenter, cost_center => cost_center.products, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL'
  })
  cost_center: CostCenter;

  @ManyToOne(() => Supplier, last_supplier => last_supplier.products, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL'
  })
  last_supplier: Supplier;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Product;
