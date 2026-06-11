import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async createCart(userId: string) {
    // validate
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException("User Doesn't Exits");
    }
    // create cart
    const cart = await this.prisma.cart.create({
      data: {
        userId,
        warehouseId: user.warehouseId as string,
      },
    });
    // return response∏∏
    return cart;
  }

  async addToCart(userId: string, productId: string) {
    // user selected warehouse
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.warehouseId == null) {
      throw new UnauthorizedException('Please Select Warehouse First');
    }

    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await this.createCart(userId);
    }

    if (userId !== cart?.userId) {
      throw new UnauthorizedException('You are Not Authorize for This Action');
    }

    if (user?.warehouseId !== cart?.warehouseId) {
      throw new ConflictException(
        'This Product is not Avilable in This Warehouse',
      );
    }

    const warehouseId = user.warehouseId;

    const warehouseStocks = await this.prisma.warehouseStocks.findUnique({
      where: { productId_warehouseId: { productId, warehouseId } },
    });

    // checking if product is in stock for warehouse
    if (warehouseStocks?.quantity === 0) {
      throw new BadRequestException(
        'Product Is Out Of Stock for This Warehouse',
      );
    }

    const existingCartProduct = await this.prisma.userCart.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (
      existingCartProduct?.quantity != null &&
      warehouseStocks?.quantity != null &&
      existingCartProduct.quantity >= warehouseStocks.quantity
    ) {
      throw new NotAcceptableException(
        "Product Is out of stock. You Can't Add more Products",
      );
    }

    // add or update
    const cartProduct = await this.prisma.userCart.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      update: {
        quantity: {
          increment: 1,
        },
      },
      create: {
        cartId: cart.id,
        productId,
        quantity: 1,
      },
    });

    // return res
    return {
      success: true,
      message: 'product added to Cart',
      cartProduct,
    };
  }

  async findOne(id: string, userId: string) {
    // find cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        userCarts: {
          include: {
            product: {
              omit: {
                description: true,
                sellerId: true,
                id: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException(
        "Cart Is Not Avilable Or Cart Doesn't have Any product",
      );
    }

    // total sum of price
    const cartProductPrices = cart?.userCarts?.map((cartProduct) => {
      return cartProduct.quantity * cartProduct.product.price;
    });

    const totalPrice = cartProductPrices?.reduce(
      (acc, item) => (acc += item),
      0,
    );
    // and with totalSum
    return {
      success: true,
      totalPrice,
      cart,
    };
  }

  async removeFromCart(productId: string, userId: string, cartId: string) {
    // find cart & userCart

    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
    });

    if (userId !== cart?.userId) {
      throw new UnauthorizedException('You are not Authorize');
    }

    const userProduct = await this.prisma.userCart.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });

    if (userProduct?.quantity == 1) {
      await this.prisma.userCart.delete({
        where: {
          cartId_productId: {
            cartId,
            productId,
          },
        },
      });

      return {
        success: true,
        message: 'Product Removed from Cart',
      };
    } else {
      const userProduct = await this.prisma.userCart.update({
        where: {
          cartId_productId: {
            cartId,
            productId,
          },
        },
        data: {
          quantity: {
            decrement: 1,
          },
        },
      });

      return {
        success: true,
        message: 'Product Updated',
        userProduct,
      };
    }
  }

  async removeCart(cartId: string) {
    await this.prisma.cart.delete({
      where: { id: cartId },
    });

    return {
      success: true,
      message: 'Cart Deleted',
    };
  }
}
