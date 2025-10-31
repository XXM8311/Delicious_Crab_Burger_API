import { Category } from 'src/category/entities/category.entities';
import { Meals } from 'src/meals/entities/meal.entity';
import { RoleConfig } from 'src/roleConfig/entities/roleConfig.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  phone: string;
  @Column()
  password: string;
  @OneToOne(() => RoleConfig, (roleConfig) => roleConfig.role)
  roleConfig;
  @OneToMany(() => Category, (category) => category.role)
  category: Category[]; // 一个角色对应多个分类
  @OneToMany(() => Meals, (meals) => meals.role)
  meals: Meals[]; // 一个角色对应多个菜品
}
