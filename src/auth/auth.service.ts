import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/Register.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './dto/Login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(registerData: RegisterDto) {
    // validate
    // hash pass
    const hash = await bcrypt.hash(registerData.password, 10);

    // create user
    const user = await this.prisma.user.create({
      data: {
        email: registerData.email,
        password: hash,
        name: registerData.name,
      },
    });

    // return response
    return user;
  }

  async login(loginData: LoginDto) {
    // find user by email
    const existingUser = await this.prisma.user.findUnique({
      where: { email: loginData.email },
    });

    if (!existingUser) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    // compare password
    const isMatch = await bcrypt.compare(
      loginData.password,
      existingUser.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    // jwt token
    const payload = { sub: existingUser.id, role: existingUser.role };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '60m',
    });
    // set cookie

    return access_token;
  }
}
