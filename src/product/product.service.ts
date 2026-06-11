import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { Product } from 'generated/prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(
    createProductDto: CreateProductDto,
    role: string,
    sellerId: string,
  ) {
    // validate
    // user must be seller to add product
    if (role !== 'SELLER') {
      throw new UnauthorizedException('You are Not Authorize');
    }

    if (createProductDto.price < 5) {
      throw new NotAcceptableException('Price must be more than 5');
    }

    if (createProductDto.price > 10000) {
      throw new NotAcceptableException('Price Must be Less than 10000');
    }

    // create product
    // seller id also need to be store in product
    const product: Product = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        brand: createProductDto.brand,
        category: createProductDto.category,
        price: createProductDto.price,
        sellerId,
      },
    });

    // return response
    return {
      success: true,
      message: 'Product Created',
      product,
    };
  }

  async findAll() {
    const products = await this.prisma.product.findMany();
    if (!products) {
      throw new NotFoundException('Products Not Found');
    }
    return {
      success: true,
      products,
    };
  }

  async findOne(id: string) {
    const product: Product | null = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product Not Found');
    }
    return {
      success: true,
      product,
    };
  }

  async findAllProductOfSeller(userId: string, role: string) {
    if (role !== 'SELLER') {
      throw new UnauthorizedException('You are not Authorize');
    }

    const products = await this.prisma.product.findMany({
      where: { sellerId: userId },
    });

    if (!products) {
      throw new NotFoundException('Products Not Found');
    }

    return {
      success: true,
      products,
    };
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    role: string,
    userId: string,
  ) {
    // only seller can edit product
    if (role !== 'SELLER') {
      throw new UnauthorizedException('You are Not Authorize');
    }

    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException("Product Doesn't Exits");
    }

    // Product only changed by seller who added it
    if (existingProduct?.sellerId !== userId) {
      throw new UnauthorizedException(
        'You have not permissiong to change this product',
      );
    }

    const product: Product = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
    return {
      success: true,
      message: 'Product Updated Successfully',
      product,
    };
  }

  async remove(id: string, userId: string) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException("Product Doesn't Exits");
    }

    // Product only changed by seller who added it
    if (existingProduct?.sellerId !== userId) {
      throw new UnauthorizedException(
        'You have not permissiong to change this product',
      );
    }
    await this.prisma.product.delete({
      where: { id },
    });
    return {
      success: true,
      message: 'Product Deleted Successfuly',
    };
  }
}
