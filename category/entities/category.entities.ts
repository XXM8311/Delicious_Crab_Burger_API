import { Meals } from 'src/meals/entities/meal.entity';
import { Role } from 'src/role/entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  status: number; // 0:禁用 1:启用
  @Column()
  createTime: Date;
  @Column()
  updateTime: Date;
  @ManyToOne(() => Role, (role) => role.category)
  @JoinColumn({ name: 'role_id' })
  role: Role;
  @OneToMany(() => Meals, (meals) => meals.category)
  meals: Meals[];
}
