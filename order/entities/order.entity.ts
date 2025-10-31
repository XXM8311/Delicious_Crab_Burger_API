import { OrderDetail } from 'src/order_details/entities/order_detail.entity';
import { MiniProgramUser } from 'src/user/entities/UserForMiniProgram.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  order_number: string; //订单号
  @Column()
  status: number; //订单状态 0:待支付 1:制作中 2:已完成 3:已取消
  @Column()
  total_price: number; //订单总价
  @Column()
  order_time: Date; //下单时间
  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetail: OrderDetail[]; //订单详情
  @ManyToOne(() => MiniProgramUser, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: MiniProgramUser; //用户
}
