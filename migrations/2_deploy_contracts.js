let MyToken = artifacts.require('MyToken.sol')
let MyTokenSale = artifacts.require('MyTokenSale')
let KycContract = artifacts.require('KycContract')
require('dotenv').config({path: '../.env'});

module.exports = async(deployer) => {
    let addr = await web3.eth.getAccounts();
    await deployer.deploy(MyToken, process.env.INITIAL_TOKEN_SUPPLY);
    await deployer.deploy(KycContract)
;    await deployer.deploy(MyTokenSale, 1, addr[0], MyToken.address, KycContract.address);
    let instance = await MyToken.deployed();
    instance.transfer(MyTokenSale.address, process.env.INITIAL_TOKEN_SUPPLY);
}