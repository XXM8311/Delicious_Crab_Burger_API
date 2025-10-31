import { Module } from '@nestjs/common';
import { RoleConfigService } from './roleConfig..service';
import { RoleConfigController } from './roleConfig.controller';

@Module({
  controllers: [RoleConfigController],
  providers: [RoleConfigService],
})
export class RoleConfigModule {}
