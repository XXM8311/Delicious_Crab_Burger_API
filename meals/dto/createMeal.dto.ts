import { IsNotEmpty, Length } from 'class-validator';

export class CreateMealDto {
  @IsNotEmpty({ message: '商品名称不能为空' })
  @Length(1, 50, { message: '商品名称长度为1-50位' })
  name: string;
  @IsNotEmpty({ message: '售价不能为空' })
  price: number;
  @IsNotEmpty({ message: '原价不能为空' })
  originalPrice: number;
  @IsNotEmpty({ message: '商品介绍不能为空' })
  @Length(1, 200, { message: '商品介绍长度为1-200位' })
  desc: string;
  @IsNotEmpty({ message: '商品图片不能为空' })
  detailImage: string;
  @IsNotEmpty({ message: '商品库存不能为空' })
  inventory: number;
  @IsNotEmpty({ message: '商品成本不能为空' })
  cost: number;
  @IsNotEmpty({ message: '商品分类不能为空' })
  categoryName: string;
  @IsNotEmpty({ message: '海报图片不能为空' })
  placardImage: string;
}
