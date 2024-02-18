import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { PrismaService } from './prisma/prisma.service';
import { CreateOrderDTO } from './dtos/create-order.dto';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    private prismaService: PrismaService,
    @Inject('ORDERS_SERVICE') private kafkaClient: ClientKafka,
  ) {}

  async all() {
    return await this.prismaService.order.findMany();
  }

  async create(data: CreateOrderDTO) {
    const order = await this.prismaService.order.create({
      data: {
        ...data,
        status: 'PENDING',
      },
    });

    // Fazer com que essa chamada seja de uma interface (Implementar inversão de dependencia)
    await lastValueFrom(this.kafkaClient.emit('orders', order));

    return order;
  }

  async complete(id: string, status: string) {
    return await this.prismaService.order.update({
      where: { id },
      data: { status },
    });
  }

  async listPaymentsApproved() {
    return await lastValueFrom(
      this.kafkaClient.send('payments-approved', JSON.stringify({})),
    );
  }

  async listPaymentsByStatus(status: string) {
    return await lastValueFrom(
      this.kafkaClient.send(
        'list-status-payments',
        JSON.stringify({ status: status.toUpperCase() }),
      ),
    );
  }

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('payments-approved');
    this.kafkaClient.subscribeToResponseOf('list-status-payments');
  }
}
