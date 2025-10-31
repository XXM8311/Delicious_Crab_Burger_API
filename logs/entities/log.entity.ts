import { MiniProgramUser } from 'src/user/entities/UserForMiniProgram.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  operateName: string;
  @Column()
  title: string;
  @Column()
  message: string;
  @Column()
  operateTime: Date;
  @ManyToOne(() => MiniProgramUser, (user) => user.logs)
  @JoinColumn({ name: 'user_id' })
  user: MiniProgramUser;
}
