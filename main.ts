import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cors from 'cors';
import { ResponseIntercept } from './interception/responseIntercept';
import { exceptionInterception } from './interception/exceptionInterception';
import { join } from 'path';
import { LogInterceptor } from './middleware';
import * as session from 'express-session';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = new ConfigService();
  app.setGlobalPrefix(configService.get('API_PREFIX'));
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(cors());
  app.useStaticAssets(join(__dirname, '../upload'), { prefix: '/image' });
  app.useGlobalInterceptors(new ResponseIntercept()); //响应拦截器
  app.useGlobalFilters(new exceptionInterception()); //异常拦截器
  app.useGlobalPipes(new ValidationPipe()); //全局验证
  app.use(new LogInterceptor().use); //日志拦截器
  app.use(
    session({
      secret: configService.get('SESSION_SECRET'), //签名密钥
      rolling: true, //每次用户与应用程序交互时，session 的生命周期将被重置
      name: configService.get('SESSION_NAME'),
      cookie: { httpOnly: true, maxAge: 1000 * 60 * 5 }, //过期时间
    }),
  );
  const port = configService.get('PORT') || 8311;
  await app.listen(port);
}
bootstrap();
