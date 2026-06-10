import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'test@gmail.com',
    required: true,
  })
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'yourpassword',
    required: true,
  })
  @Transform(({ value }: { value: string }) => value.trim())
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  password!: string;
}
