import { Controller } from '@nestjs/common';
import { UserConfigService } from './userConfig.service';

@Controller('user-config')
export class UserConfigController {
  constructor(private readonly userConfigService: UserConfigService) {}
}
