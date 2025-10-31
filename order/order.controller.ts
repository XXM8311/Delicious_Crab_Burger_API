import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { JwtService } from '@nestjs/jwt';

@Controller({
  path: 'order',
  version: '1',
})
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly JwtService: JwtService,
  ) {}

  @Post()
  async createOrder(@Body() CreateOrderDto: CreateOrderDto, @Req() req) {
    const data = await this.JwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.orderService.createOrder(CreateOrderDto, data.id);
  }

  @Get()
  async getOrder(@Query() query: { state: number }, @Req() req) {
    const data = await this.JwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.orderService.getOrder(data.id, query.state);
  }

  @Patch()
  async updateOrder(
    @Body() body: { state: number; orderId: number },
    @Req() req,
  ) {
    const data = await this.JwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.orderService.updateOrder(body.state, body.orderId, data.id);
  }

  @Get('/:id')
  async getOrderByOrderId(@Req() req, @Param() param: { id: number }) {
    const data = await this.JwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.orderService.getOrderByOrderId(param.id, data.id);
  }
}
