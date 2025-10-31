import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meals } from 'src/meals/entities/meal.entity';
import { Order } from './entities/order.entity';
import { OrderDetail } from 'src/order_details/entities/order_detail.entity';
import { MiniProgramUser } from 'src/user/entities/UserForMiniProgram.entity';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [
    TypeOrmModule.forFeature([Meals, Order, OrderDetail, MiniProgramUser]),
  ],
})
export class OrderModule {}
