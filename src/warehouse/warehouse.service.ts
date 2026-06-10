import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { PrismaService } from 'src/prisma.service';
import { CreateWarehouseStockDto } from './dto/create-warehouseStock.dto';

@Injectable()
export class WarehouseService {
  constructor(private prisma: PrismaService) {}

  async create(createWarehouseDto: CreateWarehouseDto) {
    // create warehouse
    const warehouse = await this.prisma.warehouse.create({
      data: createWarehouseDto,
    });
    // sent response
    return {
      success: true,
      warehouse,
    };
  }

  async addProdcutsToWarehouse(
    createWarehouseStock: CreateWarehouseStockDto,
    warehouseId: string,
  ) {
    // validation
    if (createWarehouseStock.quantity < 1) {
      throw new BadRequestException('Quantity must be One or more that One');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: createWarehouseStock.productId },
    });

    if (!product) {
      throw new NotFoundException('Product Not Found');
    }

    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse Not Found');
    }
    // add into warehouse
    const warehouseStock = await this.prisma.warehouseStocks.create({
      data: {
        productId: createWarehouseStock.productId,
        quantity: createWarehouseStock.quantity,
        warehouseId: warehouseId,
      },
    });
    // return response
    return {
      success: true,
      warehouseStock,
    };
  }

  async findAll() {
    const warehouses = await this.prisma.warehouse.findMany();
    return {
      success: true,
      warehouses,
    };
  }

  async getWarehouseProducts(warehouseId: string) {
    // find warehousestocks
    const warehouseStocks = await this.prisma.warehouseStocks.findMany({
      where: { warehouseId: warehouseId },
      select: {
        productId: true,
        warehouseId: true,
        id: true,
        quantity: true,
        warehouse: {
          select: {
            name: true,
            city: true,
          },
        },
        product: {
          select: {
            name: true,
            brand: true,
            price: true,
          },
        },
      },
    });
    //return response
    return {
      success: true,
      warehouseStocks,
    };
  }

  async update(id: string, updateWarehouseDto: UpdateWarehouseDto) {
    // update warehouse
    const warehouse = await this.prisma.warehouse.update({
      where: { id },
      data: updateWarehouseDto,
    });
    return {
      success: true,
      warehouse,
    };
  }

  async remove(id: string) {
    await this.prisma.warehouse.delete({
      where: { id },
    });
    return {
      success: true,
    };
  }

  async selectWarehouse(warehouseId: string, userId: string) {
    // validate
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse Not Found');
    }
    // add to user

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { warehouseId },
    });
    // return response
    return {
      success: true,
      user,
    };
  }
}
