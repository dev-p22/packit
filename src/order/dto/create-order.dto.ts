import { Payment } from 'generated/prisma/enums';

export class CreateOrderDto {
  payment_type!: Payment;
}
