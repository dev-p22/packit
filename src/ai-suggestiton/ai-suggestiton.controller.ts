import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AiSuggestitonService } from './ai-suggestiton.service';
import { langChainService } from './langChain.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { AuthRequest } from 'src/common/interfaces/interface';
// import { JwtAuthGuard } from '/src/auth/jwt-auth.guard';
// import type { AuthRequest } from '/src/common/interfaces/interface';

@Controller('ai-suggestiton')
export class AiSuggestitonController {
  constructor(
    private readonly aiSuggestitonService: AiSuggestitonService,
    private readonly langChainService: langChainService,
  ) {}

  @Post()
  async create(@Body('query') query: string) {
    return await this.langChainService.suggestiton(query);
  }

  @Get('last-order')
  @UseGuards(JwtAuthGuard)
  async suggestFromLastOrder(@Req() req: AuthRequest) {
    return this.aiSuggestitonService.suggestFromLastOrder(req.user.userId);
  }
}
