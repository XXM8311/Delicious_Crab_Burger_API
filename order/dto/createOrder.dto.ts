interface Meals {
  id: number;
  price: number;
  quantity: number;
}

export class CreateOrderDto {
  meals: Meals[]; //餐品列表
  diningType: number; //用餐类型
  remark: string; //备注
}
