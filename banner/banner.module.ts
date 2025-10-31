import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { banner } from './entities/banner.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
@Module({
  controllers: [BannerController],
  providers: [BannerService],
  imports: [
    TypeOrmModule.forFeature([banner]),
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../upload'), //配置文件上传路径
        filename: (req, file, cb) => {
          const filename = `banner${new Date().getTime() + extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
    }),
  ],
})
export class BannerModule {}
