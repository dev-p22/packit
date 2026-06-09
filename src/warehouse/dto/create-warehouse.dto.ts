import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateWarehouseDto {
  @IsNotEmpty()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(30, { message: 'Name must be under 30 characters' })
  @Transform(({ value }: { value: string }) => value.trim())
  @IsString()
  name!: string;

  @IsNotEmpty()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(30, { message: 'Name must be under 30 characters' })
  @Transform(({ value }: { value: string }) => value.trim())
  @IsString()
  city!: string;
}
