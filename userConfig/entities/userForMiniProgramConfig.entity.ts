import { MiniProgramUser } from 'src/user/entities/UserForMiniProgram.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class userForMiniProgramConfig {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  nickName: string;
  @Column()
  avatarUrl: string;
  @Column()
  gender: number;
  @Column()
  birthday: string;
  @Column()
  status: number;
  @Column()
  creatTime: Date;
  @Column()
  updateTime: Date;
  @OneToOne(() => MiniProgramUser, (user) => user.userConfig)
  @JoinColumn({ name: 'user_id' })
  user: MiniProgramUser;
}
