import { IsNotEmpty, Length } from 'class-validator';

export class updateCategoryDto {
  @IsNotEmpty({ message: '分类名称不能为空' })
  @Length(3, 12, { message: '分类名称长度在1-12之间' })
  name: string;
  @IsNotEmpty({ message: '分类id不能为空' })
  categoryId: number;
}
