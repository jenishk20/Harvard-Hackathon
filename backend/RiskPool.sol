// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RiskPool {
    address public owner;
    mapping(address => uint256) public contributions;
    mapping(address => bool) public hasClaimed;
    uint256 public totalPool;
    
    event Contribution(address indexed contributor, uint256 amount);
    event ClaimRequested(address indexed claimant, uint256 amount);
    event ClaimApproved(address indexed claimant, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function contribute() public payable {
        require(msg.value > 0, "Must send some HBAR to contribute");
        contributions[msg.sender] += msg.value;
        totalPool += msg.value;
        emit Contribution(msg.sender, msg.value);
    }

    function requestClaim(uint256 amount) public {
        require(!hasClaimed[msg.sender], "Already claimed");
        require(amount <= totalPool, "Insufficient pool funds");
        require(contributions[msg.sender] > 0, "Must contribute before claiming");

        hasClaimed[msg.sender] = true;
        totalPool -= amount;
        payable(msg.sender).transfer(amount);
        
        emit ClaimApproved(msg.sender, amount);
    }

    function getPoolBalance() public view returns (uint256) {
        return totalPool;
    }
}
