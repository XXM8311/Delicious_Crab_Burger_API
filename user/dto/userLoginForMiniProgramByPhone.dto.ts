import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
export class userLoginForMiniProgramByphoneDto {
  @IsNotEmpty({ message: '手机号码不能为空' })
  @IsPhoneNumber('CN') //手机号码验证
  phone: string;
  @IsNotEmpty({ message: '验证码不能为空' })
  code: string;
  creatTime: Date;
  updateTime: Date;
}
