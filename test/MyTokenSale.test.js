let MyToken = artifacts.require('MyToken.sol')
let MyTokenSale = artifacts.require('MyTokenSale.sol')
let KycContract = artifacts.require('KycContract.sol')

let chai = require('./setup.js');
let BN = web3.utils.BN;
const expect = chai.expect;

require('dotenv').config({path: '../.env'});

contract('MyTokenSale Test', async(accounts) => {

    const [deployerAccount, account1] = accounts;

    it('deployer address should be empty', async() => {
        let instance = await MyToken.deployed();
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN('0'));
    })

    it('all tokens should be in the smart contract address', async() => {
        let instance = await MyToken.deployed();
        let smartContractBalance = await instance.balanceOf(MyTokenSale.address);
        let totalSupply = await instance.totalSupply();
        return expect(smartContractBalance).to.be.a.bignumber.equal(totalSupply)
    })

    it('should be possible to purchase tokens', async() => {
        let tokenInstance = await MyToken.deployed();
        let tokenSaleInstance = await MyTokenSale.deployed();
        let kycInstance = await KycContract.deployed();
        let tokenAmount = 100;
        let balanceBefore = await tokenInstance.balanceOf(deployerAccount);
        await kycInstance.setKycCompleted(deployerAccount, {from: deployerAccount});
        await expect(tokenSaleInstance.sendTransaction({from: deployerAccount, value: tokenAmount})).to.be.fulfilled;
        return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceBefore.add(new BN(tokenAmount)))
    })
})