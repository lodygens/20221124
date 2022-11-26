import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("claimtokens")
  claimTokens(@Body('body') body: any)  {
    return this.appService.claimTokens();
  }

}
