import { IsNotEmpty } from 'class-validator';

export class addBannerDto {
  @IsNotEmpty({ message: '请输入轮播图名称' })
  name: string;
  @IsNotEmpty({ message: '请上传轮播图图片地址' })
  url: string;
}
