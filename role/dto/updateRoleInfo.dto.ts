import { IsNotEmpty, Length } from 'class-validator';

export class UpdateRoleInfoDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(1, 6, { message: '用户名长度在1-6位之间' })
  nickName: string;
  @IsNotEmpty({ message: '头像地址不能为空' })
  avatarUrl: string;
}
