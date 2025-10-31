import { Log } from 'src/logs/entities/log.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { userForMiniProgramConfig } from '../../userConfig/entities/userForMiniProgramConfig.entity';
import { Order } from 'src/order/entities/order.entity';

@Entity()
export class MiniProgramUser {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  phone: string;
  @Column({ nullable: true })
  password: string;
  @OneToMany(() => Log, (log) => log.user)
  logs: Log[];
  @OneToOne(() => userForMiniProgramConfig, (userConfig) => userConfig.user)
  userConfig: userForMiniProgramConfig;
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
