import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma.service';
import { isUuid } from 'src/common/helpers/isUuid';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}
  async create(
    createOrderDto: CreateOrderDto,
    warehouseId: string,
    userId: string,
  ) {
    if (!isUuid(warehouseId)) {
      throw new BadRequestException('warehouseId is not Valid');
    }

    // add cart products to orderProducts
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
      throw new NotFoundException('Cart Not Found');
    }

    if (cart.userId !== userId) {
      throw new UnauthorizedException('You are not Authorize for this action');
    }
    // create Order
    const order = await this.prisma.order.create({
      data: {
        payment_type: createOrderDto.payment_type,
        warehouseId: warehouseId,
        userId: userId,
      },
    });

    await Promise.all(
      cart?.userCarts.map(async (item) => {
        await this.prisma.orderedProduct.create({
          data: {
            name: item.product.name,
            price: item.product.price,
            brand: item.product.brand,
            productId: item.productId,
            orderId: order.id,
            quantity: item.quantity,
          },
        });

        const productId = item.productId;

        // remove stocks from warehouse
        await this.prisma.warehouseStocks.update({
          where: { productId_warehouseId: { productId, warehouseId } },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }) || [],
    );

    // remove Cart after successful order
    await this.prisma.cart.delete({
      where: { id: cart?.id },
    });

    // return response
    return {
      success: true,
      message: 'cart Ordered',
      order,
    };
  }

  async findAll(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        orderedProducts: {
          omit: {
            orderId: true,
          },
        },
      },
    });
    return {
      success: true,
      orders,
    };
  }

  async findOne(orderId: string) {
    if (!isUuid(orderId)) {
      throw new BadRequestException('orderId is not Valid');
    }
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        orderedProducts: {
          omit: {
            orderId: true,
          },
        },
      },
    });
    return {
      success: true,
      order,
    };
  }
}
