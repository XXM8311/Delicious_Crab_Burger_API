import { IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';
export class regUserForMiniProgramDto {
  @IsNotEmpty({ message: '手机号码不能为空' })
  @IsPhoneNumber('CN', { message: '手机号格式不正确' }) //手机号码验证
  phone: string;
  @IsNotEmpty({ message: '验证码不能为空' })
  code: string;
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 12, { message: '密码长度为6-12位' })
  password: string;
  creatTime: Date;
  updateTime: Date;
}
