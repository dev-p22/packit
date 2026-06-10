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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { AuthRequest } from 'src/common/interfaces/interface';

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
  async findAll() {
    return this.productService.findAll();
  }

  @Get('/seller')
  async findAllProductBySeller(@Req() req: AuthRequest) {
    return this.productService.findAllProductOfSeller(
      req.user?.userId,
      req.user?.role,
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
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
