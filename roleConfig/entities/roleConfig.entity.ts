import { Role } from 'src/role/entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RoleConfig {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  nickName: string; //角色名称
  @Column()
  status: number; //0-正常 1-禁用
  @Column()
  avatarUrl: string;
  @Column()
  lv: number; //0-管理员 1-店长 2-普通员工
  @Column()
  createTime: Date;
  @Column()
  updateTime: Date;
  @OneToOne(() => Role, (role) => role.roleConfig)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
