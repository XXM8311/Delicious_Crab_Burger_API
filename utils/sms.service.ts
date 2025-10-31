// sms.service.ts
import { Injectable } from '@nestjs/common';
import { Config } from '@alicloud/openapi-client';
import Dysmsapi20170525, { SendSmsRequest } from '@alicloud/dysmsapi20170525';
import { RuntimeOptions } from '@alicloud/tea-util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class smsService {
  private client: Dysmsapi20170525;

  constructor(private readonly ConfigService: ConfigService) {
    const config = new Config({
      accessKeyId: this.ConfigService.get('ACCESSKEYID'),
      accessKeySecret: this.ConfigService.get('ACCESSKEYSECRET'),
    });
    config.endpoint = 'dysmsapi.aliyuncs.com';
    this.client = new Dysmsapi20170525(config);
  }

  async sendSms(phoneNumbers: string, code: string) {
    const sendSmsRequest = new SendSmsRequest({
      signName: this.ConfigService.get('Alicloud_SINGNAME'),
      templateCode: this.ConfigService.get('Alicloud_TEMPLATECODE'),
      phoneNumbers,
      templateParam: `{"code":"${code}"}`,
    });
    const runtime = new RuntimeOptions();
    try {
      const resp = await this.client.sendSmsWithOptions(
        sendSmsRequest,
        runtime,
      );
      return JSON.stringify(resp);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
