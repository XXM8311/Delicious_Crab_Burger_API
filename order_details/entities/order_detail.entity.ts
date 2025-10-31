import { Meals } from 'src/meals/entities/meal.entity';
import { Order } from 'src/order/entities/order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number; //订单详情id
  @Column()
  quantity: number; //份数
  @Column()
  price: number; //价格
  @Column()
  diningType: number; //用餐类型 0:堂食 1:自提
  @Column()
  remark: string; //备注
  @ManyToOne(() => Order, (order) => order.orderDetail)
  @JoinColumn({ name: 'order_id' })
  order: Order;
  @ManyToMany(() => Meals, (meal) => meal.orderDetails)
  @JoinTable({ name: 'order_detail_meals' })
  meals: Meals[];
}
