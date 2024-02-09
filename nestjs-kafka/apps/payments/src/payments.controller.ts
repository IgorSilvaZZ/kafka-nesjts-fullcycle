import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

interface PaymentMessage {
  id: string;
  price: number;
  client_id: string;
}
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async all() {
    return await this.paymentsService.all();
  }

  @MessagePattern('orders')
  async payment(@Payload() message: PaymentMessage) {
    await this.paymentsService.create({
      amount: message.price,
      client_id: message.client_id,
      order_id: message.id,
      status: 'APPROVED',
    });
  }
}
