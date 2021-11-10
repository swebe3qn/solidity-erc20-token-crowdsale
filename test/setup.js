"use strict"
let chai = require('chai');
let BN = web3.utils.BN;
let chaiBN = require('chai-bn')(BN);
chai.use(chaiBN);
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
module.exports = chai;