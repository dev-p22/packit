import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { CreateWarehouseStockDto } from './dto/create-warehouseStock.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('warehouse')
@UseGuards(JwtAuthGuard)
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehouseService.create(createWarehouseDto);
  }
  @Post('/:warehouseId/product')
  add(
    @Body() createWarehouseStock: CreateWarehouseStockDto,
    @Param('warehouseId') warehouseId: string,
  ) {
    return this.warehouseService.addProdcutsToWarehouse(
      createWarehouseStock,
      warehouseId,
    );
  }

  @Get()
  findAll() {
    return this.warehouseService.findAll();
  }

  @Get('/:warehouseId')
  getWarehouseStocks(@Param('warehouseId') warehouseId: string) {
    return this.warehouseService.getWarehouseProducts(warehouseId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehouseService.update(id, updateWarehouseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehouseService.remove(id);
  }
}
