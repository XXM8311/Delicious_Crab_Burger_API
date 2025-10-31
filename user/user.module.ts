import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiniProgramUser } from './entities/UserForMiniProgram.entity';
import { axiosService } from 'src/utils/axios.service';
import { smsService } from 'src/utils/sms.service';
import { redisService } from 'src/utils/redis.service';
import { bcryptService } from 'src/utils/bcrypt.service';
import { ConfigService } from '@nestjs/config';
import { userForMiniProgramConfig } from 'src/userConfig/entities/userForMiniProgramConfig.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../upload'), //配置文件上传路径
        filename: (req, file, cb) => {
          const filename = `miniProgramUser${new Date().getTime() + extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
    }),
    TypeOrmModule.forFeature([MiniProgramUser, userForMiniProgramConfig]), //导入实体
  ],
  controllers: [UserController],
  providers: [
    ConfigService,
    UserService,
    axiosService,
    smsService,
    redisService,
    bcryptService,
  ],
})
export class UserModule {}
