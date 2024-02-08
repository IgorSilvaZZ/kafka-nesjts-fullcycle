import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { PrismaService } from './prisma/prisma.service';
import { CreateOrderDTO } from './dtos/create-order.dto';

@Injectable()
export class OrdersService {
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
}
