import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ethers, Wallet } from 'ethers';
import { inherits } from 'util';
import { threadId } from 'worker_threads';
import tokenJson from '../assets/MyToken.json'
import { environment } from "../environments/environment";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  wallet: ethers.Wallet | undefined;
  provider: ethers.providers.Provider;
  etherBalance: number | undefined;
  tokenBalance: number | undefined;
  votePower: number | undefined;
  tokenContract: ethers.Contract | undefined;
  tokenContractAddr: string | undefined;
  ballotContract: ethers.Contract | undefined;
  ballotContractAddr: string | undefined;

  constructor(private http: HttpClient) {
    this.provider = new ethers.providers.AlchemyProvider("goerli", environment.ALCHEMY_API_KEY);
    console.log(this.provider);
  }

  /**
   * This initializes this.wallet, connects it to the token contract
   * and retrieves some informations
   */
  init(_wallet: ethers.Wallet) {

    this.wallet = _wallet;

    this.http.get<{ result: string }>("http://localhost:3000/tokenaddress")
      .subscribe((answer) => {
        this.tokenContractAddr = answer.result;

        this.http.get<{ result: string }>("http://localhost:3000/ballotaddress")
          .subscribe((answer) => {
            this.ballotContractAddr = answer.result;

            if (!this.tokenContractAddr)
              throw new Error("Token Contract address unkwown")
            if (!this.ballotContractAddr)
              throw new Error("Ballot Contract address unkwown")
            if (!this.wallet)
              throw new Error("Wallet unknown")

            this.tokenContract = new ethers.Contract(this.tokenContractAddr,
              tokenJson.abi,
              this.wallet);

            this.wallet.getBalance().then((balanceBN: ethers.BigNumberish) => {
              this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBN));
            });

            this.tokenContract["balanceOf"](this.wallet.address)
              .then((tokenBN: ethers.BigNumberish) => {
                this.tokenBalance = parseFloat(ethers.utils.formatEther(tokenBN));
              })

            this.tokenContract["getVotes"](this.wallet.address)
              .then((voteBN: ethers.BigNumberish) => {
                this.votePower = parseFloat(ethers.utils.formatEther(voteBN));
              })
          })
      })
  }

  /**
   * This creates a new random wallet
   */
  createWallet() {

    this.init(ethers.Wallet.createRandom().connect(this.provider));
  }

  /**
   * This imports a wallet with environment.PRIVATE_KEY
   */

  importWallet() {
    this.init(new Wallet(environment.PRIVATE_KEY).connect(this.provider));
  }

  /**
   * This claims token
   */
  claimTokens() {
    console.log("app.component wallet.address = ", this.wallet?.address);
    this.http.post<any>("http://localhost:3000/claimtokens", {
      address: this.wallet?.address
    })
      .subscribe((answer) => {
        console.log("app.component answer = ", answer);
        const txHash = answer.result;
        this.provider.getTransaction(txHash).then((tx) => {
          tx.wait().then((receipt) => {
            console.log(receipt);
          })
        })
      })

  }

  connectBallot() {
  }

}
