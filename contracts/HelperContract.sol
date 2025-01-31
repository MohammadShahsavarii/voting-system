// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./VotingSystem.sol";

contract HelperContract {
    VotingSystem public votingSystem;

    constructor(address payable _votingSystemAddress) {
        votingSystem = VotingSystem(_votingSystemAddress);
    }

    // Function to donate ETH to the VotingSystem contract
    function donateToVotingSystem() external payable {
        require(msg.value > 0, "Must send ETH");
        (bool success, ) = address(votingSystem).call{value: msg.value}(
            abi.encodeWithSignature("donate()")
        );
        require(success, "Donation failed");
    }

    // Function to get balance of the VotingSystem contract
    function getVotingSystemBalance() external view returns (uint256) {
        return votingSystem.getContractBalance();
    }
}
