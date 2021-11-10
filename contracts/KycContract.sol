pragma solidity ^0.6.2;

contract KycContract {
    mapping(address => bool) allowed;

    function setKycCompleted() public {
        allowed[msg.sender] = true;
    }

    function setKycRevoked() public {
        allowed[msg.sender] = false;
    }

    function kycCompleted(address _addr) public view returns(bool) {
        return allowed[_addr];
    }
}