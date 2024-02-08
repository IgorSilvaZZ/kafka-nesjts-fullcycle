import { Injectable } from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';
import { CreatePaymentDTO } from './dtos/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prismaService: PrismaService) {}

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

    return payment;
  }
}
