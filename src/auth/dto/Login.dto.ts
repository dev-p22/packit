import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  password!: string;
}
