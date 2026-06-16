import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { AiSuggestitonModule } from './ai-suggestiton/ai-suggestiton.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot(), ProductModule, WarehouseModule, CartModule, OrderModule, AiSuggestitonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
