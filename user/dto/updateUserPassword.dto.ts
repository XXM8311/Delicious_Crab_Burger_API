import { IsNotEmpty, Length } from 'class-validator';
export class updateUserPasswordDto {
  @IsNotEmpty({ message: '原密码不能为空' })
  @Length(6, 12, { message: '密码长度为6-12位' })
  oldPassword: string;
  @IsNotEmpty({ message: '新密码不能为空' })
  @Length(6, 12, { message: '密码长度为6-12位' })
  newPassword: string;
  @IsNotEmpty({ message: '重复密码不能为空' })
  @Length(6, 12, { message: '密码长度为6-12位' })
  rePassword: string;
}
