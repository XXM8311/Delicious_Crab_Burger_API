import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Meals } from 'src/meals/entities/meal.entity';
import { OrderDetail } from 'src/order_details/entities/order_detail.entity';
import { MiniProgramUser } from 'src/user/entities/UserForMiniProgram.entity';
import { formattedOrders } from '../utils/formatted';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Meals)
    private readonly mealRepository: Repository<Meals>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(MiniProgramUser)
    private readonly miniProgramUserRepository: Repository<MiniProgramUser>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, uId: number) {
    const user = await this.miniProgramUserRepository.findOne({
      where: { id: uId },
    });
    if (!user) {
      throw new UnauthorizedException('用户未找到或登录失效，请重新登录');
    }

    const { meals, diningType, remark } = createOrderDto;
    if (remark.length > 50) {
      return new BadRequestException('备注不能超过50个字符');
    }

    const order = new Order();
    order.user = user;
    order.order_number = `${new Date().getTime()}`;
    order.status = 0; //订单状态 0:待支付 1:制作中 2:已完成 3:已取消 4全部
    order.order_time = new Date();
    order.total_price = meals.reduce((total, meal) => {
      return total + meal.price * meal.quantity;
    }, 0);
    await this.orderRepository.save(order);
    // 创建并保存订单详情
    let row;
    for (let i = 0; i < meals.length; i++) {
      const meal = await this.mealRepository.findBy({
        id: meals[i].id,
      });

      if (meal == null) {
        return new BadRequestException('商品不存在');
      }
      const orderDetail = new OrderDetail();
      orderDetail.remark = remark;
      orderDetail.price = meals[i].price;
      orderDetail.order = order;
      orderDetail.quantity = meals[i].quantity;
      orderDetail.meals = meal;
      orderDetail.diningType = diningType;
      row = await this.orderDetailRepository.save(orderDetail);
    }
    if (row !== null) {
      return {
        code: 200,
        data: '订单创建成功',
        orderId: row.order.id,
      };
    } else {
      return new BadRequestException('订单创建失败');
    }
  }

  async getOrder(uId: number, state) {
    const user = await this.miniProgramUserRepository.findOne({
      where: { id: uId },
    });
    if (!user) {
      throw new UnauthorizedException('登录失效，请重新登录');
    }
    // 订单状态 0:待支付 1:制作中 2:已完成 3:已取消,4全部
    if (state == 0) {
      const orderList = await this.orderRepository.find({
        where: {
          user,
          status: 0,
        },
        order: {
          order_time: 'DESC', // 按照创建时间降序排序
        },
        relations: [
          'orderDetail',
          'orderDetail.meals', // 明确指定加载orderDetail的meals关系
        ],
      });
      const data = formattedOrders(orderList);
      return {
        code: 200,
        data,
      };
    } else if (state == 1) {
      const orderList = await this.orderRepository.find({
        where: {
          user,
          status: 1,
        },
        order: {
          order_time: 'DESC', // 按照创建时间降序排序
        },
        relations: [
          'orderDetail',
          'orderDetail.meals', // 明确指定加载orderDetail的meals关系
        ],
      });
      const data = formattedOrders(orderList);
      return {
        code: 200,
        data,
      };
    } else if (state == 2) {
      const orderList = await this.orderRepository.find({
        where: {
          user,
          status: 2,
        },
        order: {
          order_time: 'DESC', // 按照创建时间降序排序
        },
        relations: [
          'orderDetail',
          'orderDetail.meals', // 明确指定加载orderDetail的meals关系
        ],
      });
      const data = formattedOrders(orderList);
      return {
        code: 200,
        data,
      };
    } else if (state == 3) {
      const orderList = await this.orderRepository.find({
        where: {
          user,
          status: 3,
        },
        order: {
          order_time: 'DESC', // 按照创建时间降序排序
        },
        relations: [
          'orderDetail',
          'orderDetail.meals', // 明确指定加载orderDetail的meals关系
        ],
      });
      const data = formattedOrders(orderList);
      return {
        code: 200,
        data,
      };
    } else {
      const orderList = await this.orderRepository.find({
        where: {
          user,
        },
        order: {
          order_time: 'DESC', // 按照创建时间降序排序
        },
        relations: ['orderDetail', 'orderDetail.meals'],
      });
      const data = formattedOrders(orderList);
      return {
        code: 200,
        data,
      };
    }
  }

  async updateOrder(state: number, orderId: number, userId: number) {
    const user = await this.miniProgramUserRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException('登录失效，请重新登录');
    }
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new BadRequestException('订单不存在');
    }
    if (state == 1) {
      order.status = 1;
      const row = await this.orderRepository.update(orderId, order);
      if (row.affected !== 0) {
        return {
          code: 200,
          data: '支付成功',
        };
      } else {
        return new BadRequestException('支付失败');
      }
    } else if (state == 2) {
      order.status = 2;
      const row = await this.orderRepository.update(orderId, order);
      if (row.affected !== 0) {
        return {
          code: 200,
          data: '订单完成',
        };
      } else {
        return new BadRequestException('订单完成失败');
      }
    } else {
      order.status = 3;
      const row = await this.orderRepository.update(orderId, order);
      if (row.affected !== 0) {
        return {
          code: 200,
          data: '订单取消',
        };
      } else {
        return new BadRequestException('订单取消失败');
      }
    }
  }

  async getOrderByOrderId(orderId: number, userId) {
    const user = await this.miniProgramUserRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException('登录失效，请重新登录');
    }
    const orderList = await this.orderRepository.find({
      where: {
        user,
        id: orderId,
      },
      relations: [
        'orderDetail',
        'orderDetail.meals', // 明确指定加载orderDetail的meals关系
      ],
    });
    const data = formattedOrders(orderList);
    return {
      code: 200,
      data,
    };
  }
}
