import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  password!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name!: string;

  @IsEnum(['USER', 'SELLER'])
  @IsOptional()
  role?: string;
}
