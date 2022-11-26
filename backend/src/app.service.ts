import { Injectable } from '@nestjs/common';
import { ethers } from "ethers";
import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as tokenJson from "./assets/MyToken.json";

const TOKEN_ADDR = "0xd5BFf3786212Be9E95F35036Dc82F07c5eb5Df85"


@Injectable()
export class AppService {

  getTokenAddress() {
    return {result: TOKEN_ADDR};
  }

  async claimTokens(address: string) {
    // todo : build the contract object
    // todo : pick the siogner using .env
    // todo : connect the contract to the signer
    // todo : make the Tx to mint token
    // todo: await the Tx, get the receipt, return the Tx hash

    return {result: `tx hash minted for ${address}`}
  }
}
