import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { WarehouseModule } from './warehouse/warehouse.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot(), ProductModule, WarehouseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
