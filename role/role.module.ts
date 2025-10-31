import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { bcryptService } from 'src/utils/bcrypt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { redisService } from 'src/utils/redis.service';
import { RoleConfig } from 'src/roleConfig/entities/roleConfig.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
@Module({
  controllers: [RoleController],
  providers: [RoleService, bcryptService, redisService],
  imports: [
    TypeOrmModule.forFeature([Role, RoleConfig]),
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../upload'), //配置文件上传路径
        filename: (req, file, cb) => {
          const filename = `BackgroundManagement${new Date().getTime() + extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
    }),
  ],
})
export class RoleModule {}
