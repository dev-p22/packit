import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/Register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/Login.dto';
import type { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  register(@Body() registerData: RegisterDto) {
    return this.authService.create(registerData);
  }
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginData: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(loginData);
    if (token) {
      res.cookie('access_token', token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      });
    }
    return {
      success: true,
      message: 'Login Successfully',
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');

    return {
      success: true,
      message: 'Logout successfully',
    };
  }
}
