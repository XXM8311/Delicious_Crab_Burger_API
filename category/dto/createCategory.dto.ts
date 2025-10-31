import { IsNotEmpty, Length } from 'class-validator';

export class createCategoryDto {
  @IsNotEmpty({ message: '分类名称不能为空' })
  @Length(1, 12, { message: '分类名称长度在1-12之间' })
  name: string;
}
