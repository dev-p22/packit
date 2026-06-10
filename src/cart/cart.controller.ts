import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { AuthRequest } from 'src/common/interfaces/interface';

@Controller('warehouse/:warehouseId/cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/addProduct/:productId')
  async add(@Param('productId') productId: string, @Req() req: AuthRequest) {
    return await this.cartService.addToCart(req.user?.userId, productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.cartService.findOne(id, req.user?.userId);
  }

  @Post(':cartId/removeProduct/:productId')
  update(
    @Param('productId') productId: string,
    @Req() req: AuthRequest,
    @Param('cartId') cartId: string,
  ) {
    return this.cartService.removeFromCart(productId, req.user?.userId, cartId);
  }
}
