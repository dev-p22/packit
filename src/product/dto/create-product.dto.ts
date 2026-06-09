import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Category } from 'generated/prisma/enums';

export class CreateProductDto {
  @IsNotEmpty()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(30, { message: 'Name must be under 30 characters' })
  @Transform(({ value }: { value: string }) => value.trim())
  @IsString()
  name!: string;

  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  @MinLength(2, { message: 'Brand must be at least 2 characters long' })
  @MaxLength(30, { message: 'Brand must be under 30 characters' })
  @IsString()
  brand!: string;

  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  @MinLength(2, { message: 'Description must be at least 2 characters long' })
  @MaxLength(100, { message: 'Description must be under 30 characters' })
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsNumber()
  price!: number;

  @IsEnum(Category)
  @IsNotEmpty()
  category!: Category;
}
