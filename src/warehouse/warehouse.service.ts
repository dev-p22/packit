import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { PrismaService } from 'src/prisma.service';
import { CreateWarehouseStockDto } from './dto/create-warehouseStock.dto';
import { isUuid } from 'src/common/helpers/isUuid';

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
      message: 'warehouse Created',
      warehouse,
    };
  }

  async addProdcutsToWarehouse(
    createWarehouseStock: CreateWarehouseStockDto,
    warehouseId: string,
  ) {
    // validation

    if (!isUuid(warehouseId)) {
      throw new BadRequestException('warehouseId is not Valid');
    }

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

    if (createWarehouseStock.quantity > 10000) {
      throw new NotAcceptableException(
        'Quantity more than 10000 is not acceptable',
      );
    }

    const productId = createWarehouseStock.productId;
    // add into warehouse
    const warehouseStock = await this.prisma.warehouseStocks.upsert({
      where: { productId_warehouseId: { productId, warehouseId } },
      update: { quantity: { increment: createWarehouseStock.quantity } },
      create: {
        productId: createWarehouseStock.productId,
        quantity: createWarehouseStock.quantity,
        warehouseId: warehouseId,
      },
    });
    // return response
    return {
      success: true,
      message: 'Product Added To Warehouse',
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
    if (!isUuid(warehouseId)) {
      throw new BadRequestException('warehouseId is not Valid');
    }
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
    if (!isUuid(id)) {
      throw new BadRequestException('warehouseId is not Valid');
    }
    // update warehouse
    const warehouse = await this.prisma.warehouse.update({
      where: { id },
      data: updateWarehouseDto,
    });
    return {
      success: true,
      message: 'warehouse Updated',
      warehouse,
    };
  }

  async remove(id: string) {
    if (!isUuid(id)) {
      throw new BadRequestException('warehouseId is not Valid');
    }
    await this.prisma.warehouse.delete({
      where: { id },
    });
    return {
      success: true,
      message: 'Warehouse Removed',
    };
  }

  async selectWarehouse(warehouseId: string, userId: string) {
    if (!isUuid(warehouseId)) {
      throw new BadRequestException('warehouseId is not Valid');
    }
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
      message: `${warehouse.name} at ${warehouse.city} selected`,
      user,
    };
  }
}
