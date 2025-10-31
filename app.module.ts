import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LogsModule } from './logs/logs.module';
import { UserConfigModule } from './userConfig/userConfig.module';
import * as Joi from 'joi';
import { APP_GUARD } from '@nestjs/core';
import { smsService } from './utils/sms.service';
import { redisService } from './utils/redis.service';
import { authGuard } from './guard/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { CategoryModule } from './category/category.module';
import { MealsModule } from './meals/meals.module';
import { RoleModule } from './role/role.module';
import { RoleConfigModule } from './roleConfig/roleConfig..module';
import { BannerModule } from './banner/banner.module';
import { OrderModule } from './order/order.module';
import { OrderDetailsModule } from './order_details/order_details.module';

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      validationSchema: Joi.object({
        DB_HOST: Joi.string(),
        DB_PORT: Joi.number(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_DATABASE: Joi.string(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        ({
          type: config.get('DB_TYPE'),
          host: config.get('DB_HOST'),
          port: config.get('DB_PORT'),
          username: config.get('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          autoLoadEntities: true,
          retryDelay: 500,
          retryAttempts: 10,
        }) as TypeOrmModuleOptions,
    }),
    LogsModule,
    ConfigModule,
    UserConfigModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '1d',
          },
        };
      },
    }),
    CategoryModule,
    MealsModule,
    RoleModule,
    RoleConfigModule,
    BannerModule,
    OrderModule,
    OrderDetailsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    smsService,
    redisService,
    { provide: APP_GUARD, useClass: authGuard },
  ],
})
export class AppModule {}
