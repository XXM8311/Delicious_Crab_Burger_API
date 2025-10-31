import { BadRequestException, Injectable } from '@nestjs/common';
import { smsService } from './utils/sms.service';
import { redisService } from './utils/redis.service';

@Injectable()
export class AppService {
  constructor(
    private readonly smsService: smsService,
    private readonly redisService: redisService,
  ) {}
  // 获取短信验证码
  async getVerificationCode(phone: string) {
    let code = Math.floor(Math.random() * 10000).toString();
    if (code.length < 4) {
      code = '0' + code;
    }
    const result = await this.redisService.setex(phone, code, 60);
    if (result) {
      this.smsService.sendSms(phone, code);
      return {
        code: 200,
        data: code + '短信已发送，一分钟内有效，请注意查收',
      };
    } else {
      return new BadRequestException('短信已发送，请稍后再试');
    }
  }
}
