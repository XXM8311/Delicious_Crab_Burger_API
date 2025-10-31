import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entities';
import { RoleConfig } from 'src/roleConfig/entities/roleConfig.entity';
import { Role } from 'src/role/entities/role.entity';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [TypeOrmModule.forFeature([Category, RoleConfig, Role])],
})
export class CategoryModule {}
