import React, { Component } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false, amount: 0, userTokens: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

      this.tokenInstance = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
      );

      this.tokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
      );

      this.kycInstance = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToTokenTransfer();
      this.setState({ loaded: true}, this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  listenToTokenTransfer = () => {
    this.tokenInstance.events.Transfer({to: this.accounts[0]}).on('data', this.updateUserTokens)
  }
  
  updateUserTokens = async() => {
    let tokenAmount = await this.tokenInstance.methods.balanceOf(await this.accounts[0]).call();
    this.setState({userTokens: tokenAmount.toString()});
  }

  handleWhitelist = async() => {
    await this.kycInstance.methods.setKycCompleted().send({from: this.accounts[0]});
    alert('Congrats! You are whitelisted.')
  }

  handlePurchase = async() => {
    let {amount} = this.state;
    await this.tokenSaleInstance.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: amount});
    this.setState({amount: 0});
    alert('Tokens purchased succesfully. Thank you very much!')
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Burger Token (BRGR) public crowdsale!</h1>
        <p>Whitelist your address to participate.</p>
        <div><button type="button" onClick={this.handleWhitelist}>Whitelist me!</button></div>
        <h2>Buy BRGR tokens</h2>
        <p>
          1 Wei = 1 BRGR = 1 Cheeseburger
        </p>
        <div>
          <input type="number" name="amount" value={this.state.amount} onChange={el => this.setState({amount: el.target.value})} />
          <button type="button" onClick={this.handlePurchase}>Buy BRGR tokens</button>
        </div>
        <div style={{marginTop: 20}}><strong>Your balance: </strong>{this.state.userTokens} BRGR</div>
      </div>
    );
  }
}

export default App;
