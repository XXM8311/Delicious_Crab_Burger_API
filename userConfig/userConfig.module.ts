import { Module } from '@nestjs/common';
import { UserConfigService } from './userConfig.service';
import { UserConfigController } from './userConfig.controller';

@Module({
  controllers: [UserConfigController],
  providers: [UserConfigService],
})
export class UserConfigModule {}
