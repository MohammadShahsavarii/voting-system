// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract VotingSystem {
    address public admin;
    bool public votingActive;
    IERC20 public votingToken;

    mapping(string => uint256) public votes;
    mapping(address => bool) public hasVoted;

    event VoterRegistered(address indexed voter);
    event VoteCasted(address indexed voter, string candidate);
    event VotingStarted();
    event VotingEnded();
    event DonationReceived(address indexed donor, uint256 amount);
    event FundsWithdrawn(address indexed admin, uint256 amount);
    event TokensWithdrawn(address indexed recipient, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    modifier votingOpen() {
        require(votingActive, "Voting is not active");
        _;
    }

    constructor(address _tokenAddress) payable {
        admin = msg.sender;
        votingToken = IERC20(_tokenAddress);
    }

    function startVoting() external onlyAdmin {
        votingActive = true;
        emit VotingStarted();
    }

    function endVoting() external onlyAdmin {
        votingActive = false;
        emit VotingEnded();
    }

    function registerVoter(address voter) external onlyAdmin {
        require(!hasVoted[voter], "Voter already registered");
        hasVoted[voter] = false;
        emit VoterRegistered(voter);
    }

    function vote(string memory candidate) external votingOpen {
        require(!hasVoted[msg.sender], "You have already voted");
        require(votingToken.balanceOf(msg.sender) > 0, "You need VotingTokens to vote!");

        // Transferring a token from the voter to the voting contract
        votingToken.transferFrom(msg.sender, address(this), 1);

        votes[candidate]++;
        hasVoted[msg.sender] = true;
        emit VoteCasted(msg.sender, candidate);
    }

    function getVotes(string memory candidate) external view returns (uint256) {
        return votes[candidate];
    }

    function voteWithEth(string memory candidate) external payable votingOpen {
        require(!hasVoted[msg.sender], "You have already voted");
        require(votingToken.balanceOf(msg.sender) > 0, "You need VotingTokens to vote!");
        require(msg.value == 0.01 ether, "Exact 0.01 ETH required to vote");

        votingToken.transferFrom(msg.sender, address(this), 1);
        votes[candidate]++;
        hasVoted[msg.sender] = true;

        emit VoteCasted(msg.sender, candidate);
        emit DonationReceived(msg.sender, msg.value);
    }

     // Receive and send Ethereum
    function donate() external payable {
        require(msg.value > 0, "Donation must be greater than 0");
        emit DonationReceived(msg.sender, msg.value);
    }

    function withdrawFunds() external onlyAdmin {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available");
        payable(admin).transfer(balance);
        emit FundsWithdrawn(admin, balance);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function withdrawTokens(address recipient, uint256 amount) external onlyAdmin {
        require(votingToken.balanceOf(address(this)) >= amount, "Not enough tokens in contract");
        votingToken.transfer(recipient, amount);
        emit TokensWithdrawn(recipient, amount);
    }

    receive() external payable {
        emit DonationReceived(msg.sender, msg.value);
    }

    fallback() external payable {
        emit DonationReceived(msg.sender, msg.value);
    }
}
