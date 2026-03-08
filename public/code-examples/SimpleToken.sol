// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

// This is a smart contract - a program that can be deployed to the Ethereum blockchain.
contract SimpleToken {
    // An `address` is comparable to an email address - it's used to identify an account on Ethereum.
    address public owner;
    uint256 public constant token_supply = 1000000000000;

    // A `mapping` is essentially a hash table data structure.
    // This `mapping` assigns an unsigned integer (the token balance) to an address (the token holder).
    mapping (address => uint) public balances;


	// When 'SimpleToken' contract is deployed:
	// 1. set the deploying address as the owner of the contract
	// 2. set the token balance of the owner to the total token supply
    constructor() {
        owner = msg.sender;
        balances[owner] = token_supply;
    }

    // Restricts a function so it can only be called by the contract owner.
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function.");
        _;
    }

    // Sends an amount of tokens from any caller to any address.
    function transfer(address receiver, uint amount) public {
        // The sender must have enough tokens to send
        require(amount <= balances[msg.sender], "Insufficient balance.");

        // Adjusts token balances of the two addresses
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
    }

    // An event emitted when new tokens are minted.
    event Mint(address indexed recipient, uint amount);

    // Creates new tokens and assigns them to a recipient.
    // Can only be called by the contract owner.
    function mint(address recipient, uint amount) public onlyOwner {
        require(recipient != address(0), "Cannot mint to zero address.");
        balances[recipient] += amount;
        emit Mint(recipient, amount);
    }
}
