import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { PrismaService } from './prisma/prisma.service';
import { CreatePaymentDTO } from './dtos/create-payment.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PaymentsService {
  constructor(
    private prismaService: PrismaService,
    @Inject('PAYMENTS_SERVICE') private kafkaClient: ClientKafka,
  ) {}

  async all() {
    return this.prismaService.payment.findMany();
  }

  async create(data: CreatePaymentDTO) {
    const payment = await this.prismaService.payment.create({
      data: {
        ...data,
        status: 'APPROVED',
      },
    });

    await lastValueFrom(this.kafkaClient.emit('payments', payment));

    return payment;
  }

  async listPaymentsApproved() {
    const paymentsApproved = await this.prismaService.payment.findMany({
      where: {
        status: { equals: 'APPROVED' },
      },
    });

    console.log(paymentsApproved);

    return paymentsApproved;
  }

  async listPaymentsByStatus(status: string) {
    const paymentsByStatus = await this.prismaService.payment.findMany({
      where: {
        status: { equals: status.toUpperCase() },
      },
    });

    console.log(paymentsByStatus);

    return paymentsByStatus;
  }
}
