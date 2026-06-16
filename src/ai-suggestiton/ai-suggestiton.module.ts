import { Module } from '@nestjs/common';
import { AiSuggestitonService } from './ai-suggestiton.service';
import { AiSuggestitonController } from './ai-suggestiton.controller';
import { langChainService } from './langChain.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AiSuggestitonController],
  providers: [AiSuggestitonService, langChainService, PrismaService],
})
export class AiSuggestitonModule {}
