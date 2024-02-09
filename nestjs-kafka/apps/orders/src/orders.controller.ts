import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async all() {
    return await this.ordersService.all();
  }

  @Post()
  async create(@Body() data: CreateOrderDTO) {
    return await this.ordersService.create(data);
  }

  @MessagePattern('payments')
  async complete(@Payload() message) {
    console.log(message);

    await this.ordersService.complete(
      message.order_id,
      message.status === 'APPROVED' ? 'PAYED' : 'CANCELLED',
    );
  }
}
