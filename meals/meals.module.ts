import { Module } from '@nestjs/common';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meals } from './entities/meal.entity';
import { Role } from 'src/role/entities/role.entity';
import { RoleConfig } from 'src/roleConfig/entities/roleConfig.entity';
import { Category } from 'src/category/entities/category.entities';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
@Module({
  controllers: [MealsController],
  providers: [MealsService],
  imports: [
    TypeOrmModule.forFeature([Meals, Role, RoleConfig, Category]),
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../upload'), //配置文件上传路径
        filename: (req, file, cb) => {
          const filename = `Meals${new Date().getTime() + extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
    }),
  ],
})
export class MealsModule {}
