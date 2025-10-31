import { Category } from 'src/category/entities/category.entities';
import { OrderDetail } from 'src/order_details/entities/order_detail.entity';
import { Role } from 'src/role/entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Meals {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  price: number;
  @Column()
  originalPrice: number;
  @Column()
  desc: string;
  @Column()
  placardImage: string;
  @Column()
  detailImage: string; // 图片
  @Column()
  status: number; // 0:下架 1:上架
  @Column()
  inventory: number; // 库存
  @Column()
  sales: number; // 销量
  @Column()
  cost: number; // 成本
  @ManyToOne(() => Category, (category) => category.meals)
  @JoinColumn({ name: 'category_id' })
  category: Category;
  @ManyToOne(() => Role, (role) => role.meals)
  @JoinColumn({ name: 'role_id' })
  role: Role;
  @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.meals)
  orderDetails: OrderDetail[];
}
