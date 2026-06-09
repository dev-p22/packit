import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateWarehouseStockDto {
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsUUID()
  productId!: string;

  @IsNotEmpty()
  @IsNumber()
  quantity!: number;
}
