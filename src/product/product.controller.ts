import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from 'generated/prisma/enums';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type {
  AuthRequest,
  sortByPriceEnum,
} from 'src/common/interfaces/interface';

@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto, @Req() req: AuthRequest) {
    return this.productService.create(
      createProductDto,
      req.user?.role,
      req.user?.userId,
    );
  }

  @Get()
  async findAll(
    @Query('name') name: string,
    @Query('category') category: Category,
    @Query('sortByPrice') sortByPrice: sortByPriceEnum,
  ) {
    return this.productService.findAll(name, category, sortByPrice);
  }

  @Get('/seller')
  async findAllProductBySeller(
    @Req() req: AuthRequest,
    @Query('name') name: string,
  ) {
    return this.productService.findAllProductOfSeller(
      req.user?.userId,
      req.user?.role,
      name,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: AuthRequest,
  ) {
    return this.productService.update(
      id,
      updateProductDto,
      req.user?.role,
      req.user?.userId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.productService.remove(id, req.user.userId);
  }
}
