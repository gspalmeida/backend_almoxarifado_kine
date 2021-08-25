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
import MeasureUnit from './MeasureUnit';
import CostCenter from './CostCenter';
import Supplier from './Supplier';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  unit_cost: string;

  @ManyToOne(() => MeasureUnit, unit_measure => unit_measure.products, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL',
  })
  measure_unit: MeasureUnit;

  @Column()
  qty_ordered: number;

  @Column({ nullable: true })
  qty_last_order: number;

  @Column({ nullable: true })
  qty_stocked: number;

  @Column({ nullable: true })
  max_stock_limit: number;

  @ManyToOne(() => CostCenter, cost_center => cost_center.products, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL',
  })
  cost_center: CostCenter;

  @ManyToOne(() => Supplier, last_supplier => last_supplier.products, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL',
  })
  last_supplier: Supplier;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Product;
