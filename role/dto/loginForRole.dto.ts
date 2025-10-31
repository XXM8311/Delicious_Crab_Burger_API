import { IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';

export class loginForRoleDto {
  @IsPhoneNumber('CN', { message: '手机号格式不正确' })
  @IsNotEmpty({ message: '手机号不能为空' })
  phone: string;
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 12, { message: '密码长度在6到12位之间' })
  password: string;
  @IsNotEmpty({ message: '验证码不能为空' })
  @Length(4, 4, { message: '验证码长度为4位' })
  code: string;
}
