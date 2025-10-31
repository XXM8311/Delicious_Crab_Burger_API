import { Length } from 'class-validator';

export class upateMealDto {
  @Length(1, 50, { message: '商品名称长度为1-50位' })
  name: string;
  price: number;
  originalPrice: number;
  @Length(1, 200, { message: '商品介绍长度为1-200位' })
  desc: string;
  detailImage: string;
  inventory: number;
  cost: number;
  placardImage: string;
  categoryName: string;
  mealId: number;
}
