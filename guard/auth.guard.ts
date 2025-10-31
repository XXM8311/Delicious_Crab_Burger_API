import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { redisService } from './../utils/redis.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class authGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly redisService: redisService,
    private readonly ConfigService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const authHeader = req.headers.authorization;
    const API_PREFIX = this.ConfigService.get('API_PREFIX');
    if (
      req.url.startsWith(`${API_PREFIX}/v1/verificationCode`) ||
      req.url.startsWith(`${API_PREFIX}/v1/user/miniProgram/register`) ||
      req.url.startsWith(`${API_PREFIX}/v1/user/miniProgram/login`) ||
      req.url.startsWith(`${API_PREFIX}/v1/user/miniProgram/loginByPhone`) ||
      req.url.startsWith(`${API_PREFIX}/v1/imageVerificationCode`) ||
      req.url.startsWith(`${API_PREFIX}/v1/role/login`) ||
      req.url.startsWith(`${API_PREFIX}/v1/role/register`)
    ) {
      return true;
    } else {
      if (authHeader) {
        try {
          const token = authHeader.split(' ')[1]; //获取token
          const data = await this.jwt.verify(token); // 解析toke
          if (data.source == 'miniProgram') {
            const miniProgramToken = await this.redisService.get(
              `MiniProgramUser${data.id}`,
            );
            if (miniProgramToken == false) {
              throw new UnauthorizedException('登录失效，请重新登录');
            }
            if (miniProgramToken === token) {
              return true;
            }
          } else {
            const roleToken = await this.redisService.get(
              `BackgroundManagement${data.id}`,
            );
            if (roleToken == false) {
              throw new UnauthorizedException('登录失效，请重新登录');
            }
            if (roleToken === token) {
              return true;
            }
          }
        } catch (error) {
          throw new UnauthorizedException('登录失效，请重新登录');
        }
      } else {
        throw new UnauthorizedException('登录失效，请重新登录');
      }
    }
  }
}
