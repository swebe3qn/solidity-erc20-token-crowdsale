let MyToken = artifacts.require('MyToken.sol')

let chai = require('./setup.js');
let BN = web3.utils.BN;
const expect = chai.expect;

require('dotenv').config({path: '../.env'});

contract('MyToken Test', async (accounts) => {

    const [deployerAccount, account1] = accounts;

    beforeEach(async() => {
        this.myToken = await MyToken.new(process.env.INITIAL_TOKEN_SUPPLY);
    })

    it('all tokens should be in my account', async() => {
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();

        //first option
        //let balance = await instance.balanceOf(accounts[0]);
        //assert.equal(totalSupply.toString(), balance.toString(), 'the tokens are not in my account')

        //second option (no 'await' required because of eventually)
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    })

    it('should not be possible to send more tokens than available in total', async() => {
        const instance = this.myToken;
        const balanceOfDeployer = await instance.balanceOf(deployerAccount);
        await expect(instance.transfer(account1, new BN(balanceOfDeployer+1))).to.eventually.be.rejected;
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
    })

    it('should be possible to send tokens between accounts', async() => {
        const instance = this.myToken;
        let sendTokens = 100;
        let totalSupply = await instance.totalSupply();
        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        await expect(instance.transfer(account1, sendTokens)).to.eventually.be.fulfilled;
        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(totalSupply - new BN(sendTokens)));
        return expect(instance.balanceOf(account1)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
    })
})