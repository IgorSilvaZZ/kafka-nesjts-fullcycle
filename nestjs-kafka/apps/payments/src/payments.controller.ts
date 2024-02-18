import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

interface PaymentMessage {
  id: string;
  price: number;
  client_id: string;
}

interface PaymentsStatus {
  status: string;
}
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('')
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

  // Adicionado para estudos
  @MessagePattern('payments-approved')
  async listOrdersApproved() {
    return await this.paymentsService.listPaymentsApproved();
  }

  @MessagePattern('list-status-payments')
  async listPaymentsByStatus(@Payload() data: PaymentsStatus) {
    const { status } = data;

    return await this.paymentsService.listPaymentsByStatus(
      status.toUpperCase(),
    );
  }
}
