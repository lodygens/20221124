import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ethers } from "ethers";
import { hashMessage } from 'ethers/lib/utils';

export class ClaimTokenDTO {
  address: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get("tokenaddress")
  getTokenAddress() {
    return this.appService.getTokenAddress();
  }
  
  @Post("claimtokens")
  claimTokens(@Body('body') body: ClaimTokenDTO)  {
    return this.appService.claimTokens(body.address);
  }

}
