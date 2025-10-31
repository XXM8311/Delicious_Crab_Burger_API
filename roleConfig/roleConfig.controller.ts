import { Controller } from '@nestjs/common';
import { RoleConfigService } from './roleConfig..service';

@Controller('role-config')
export class RoleConfigController {
  constructor(private readonly roleConfigService: RoleConfigService) {}
}
