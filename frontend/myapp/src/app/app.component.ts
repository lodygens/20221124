import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ethers, Wallet } from 'ethers';
import { threadId } from 'worker_threads';
import tokenJson from '../assets/MyToken.json'
import {environment} from "../environments/environment";

const TOKENIZEDBALLOT_ADDR = "0x89Eb37734C49e3478D55cF8EEcb4bD225A79C57B";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  wallet : ethers.Wallet | undefined;
  provider : ethers.providers.Provider;
  tokenContract : ethers.Contract | undefined; 
  etherBalance : number | undefined;
  tokenBalance : number | undefined;
  votePower : number | undefined;
  tokenContractAddr : string| undefined;

  constructor (private http:HttpClient) {
    this.provider = new ethers.providers.AlchemyProvider("goerli", environment.ALCHEMY_API_KEY);
  }

  createWallet() {

    this.http.get<{result:string}>("http://localhost:3000/tokenaddress")
      .subscribe((answer) => {

        this.tokenContractAddr = answer.result;

        if(this.tokenContractAddr) {
          this.wallet = ethers.Wallet.createRandom()
          .connect(this.provider);
    

          this.tokenContract = new ethers.Contract(this.tokenContractAddr,
                                                    tokenJson.abi,
                                                    this.wallet);

          this.wallet.getBalance().then((balanceBN:ethers.BigNumberish) => {
            this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBN));
          });
          this.tokenContract["balanceOf"](this.wallet.address)
            .then((tokenBN:ethers.BigNumberish) => {
              this.tokenBalance = parseFloat(ethers.utils.formatEther(tokenBN));
            })
          this.tokenContract["getVotes"](this.wallet.address)
            .then((voteBN:ethers.BigNumberish) => {
              this.votePower = parseFloat(ethers.utils.formatEther(voteBN));
            })
        }
      })

  }

  importWallet() {

  }

  claimTokens()  {
    this.http.post<any>("http://localhost:3000/claimtokens", {
      address:this.wallet?.address
    })
      .subscribe((answer) => {
        console.log({answer});
        const txHash = answer.result;
        this.provider.getTransaction(txHash).then((tx) => {
          tx.wait().then((receipt) => {
            // todo: (optional) display
          })
        })
      })

  }
  connectBallot(address :string)  {
  }

}
