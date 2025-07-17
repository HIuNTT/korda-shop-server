import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { QuoteService } from '../services/quote.service';
import { AuthUser } from '#/modules/auth/decorators/auth-user.decorator';
import { QuoteDto } from '../dto/quote.dto';
import { QuoteInfo } from '../interfaces/quote.interface';

@Controller('quote')
export class QuoteController {
  constructor(private quoteService: QuoteService) {}

  @Post('create')
  @HttpCode(HttpStatus.OK)
  async createQuote(@AuthUser() user: IAuthUser, @Body() dto: QuoteDto): Promise<void> {
    await this.quoteService.createQuote(user.uid, dto);
  }

  @Get('info')
  async info(@AuthUser() user: IAuthUser): Promise<QuoteInfo> {
    return await this.quoteService.info(user.uid);
  }
}
