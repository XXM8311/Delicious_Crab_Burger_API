import { Controller, Get, Query, Req, Res, Session } from '@nestjs/common';
import { AppService } from './app.service';
import * as svgCaptcha from 'svg-captcha';
@Controller({
  version: '1',
})
export class AppController {
  constructor(private readonly appService: AppService) {}
  //发送验证码
  @Get('verificationCode')
  getVerificationCode(@Query() queryData: { phone: string }) {
    return this.appService.getVerificationCode(queryData.phone);
  }

  @Get('imageVerificationCode')
  getImageVerificationCode(@Req() req, @Res() res, @Session() session) {
    const captcha = svgCaptcha.create({
      size: 4, //生成几位数验证码
      fontSize: 50, //文字大小
      width: 100, //宽度
      height: 34, //高度
      background: '#776daf',
    });
    session.code = captcha.text; //存储验证码密码到session中
    res.type('image/svg+xml');
    res.send(captcha.data); //图形码
  }
}
