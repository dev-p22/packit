import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import type { AuthRequest } from 'src/common/interfaces/interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('warehouse/:warehouseId/order')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/checkout')
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Param('warehouseId') warehouseId: string,
    @Req() req: AuthRequest,
  ) {
    return this.orderService.create(
      createOrderDto,
      warehouseId,
      req.user.userId,
    );
  }

  @Get('/all')
  findAll(@Req() req: AuthRequest) {
    return this.orderService.findAll(req.user.userId);
  }

  @Get(':orderId')
  findOne(@Param('orderId') orderId: string) {
    return this.orderService.findOne(orderId);
  }
}
