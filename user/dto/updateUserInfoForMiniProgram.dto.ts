import { IsNotEmpty, Length } from 'class-validator';

export class UserInfoForMiniProgramDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(1, 6, { message: '用户名长度在1-6位之间' })
  nickName: string;
  @IsNotEmpty({ message: '头像地址不能为空' })
  avatarUrl: string;
  @IsNotEmpty({ message: '性别不能为空' })
  gender: number;
  @IsNotEmpty({ message: '生日信息不能为空' })
  birthday: string;
}
