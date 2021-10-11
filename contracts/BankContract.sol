// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// A contract in the sense of Solidity is a collection 
// of code (its functions) and data (its state) that resides 
// at a specific address on the Ethereum blockchain. 
contract BankContract {
    //State variable - You can think of it as a single slot in a database 
    // that you can query and alter by calling functions of the code that 
    // manages the database.
    address public minter;
    
    // The keyword "public" makes variables
    // accessible from other contracts
    // This is suitable for storing addresses of contracts
    // public creates getter function by the compiler
    mapping (address => uint) public balances;

    // Events allow clients to react to specific
    // contract changes you declare
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor() public {
        // msg.sender is always the address where the current 
        // (external) function call came from.
        minter = msg.sender;
        // Create 1000 money to the origin account
        balances[tx.origin] = 10000;
    }

    // Sends an amount of newly created coins to an address
    // Can only be called by the contract creator
    function mint(address receiver, uint amount) public {
        //ensures that only the creator of the contract can call mint
        require(msg.sender == minter);
        balances[receiver] += amount;
    }

    function deposit(address receiver, uint amount) public returns(bool sufficient) {
        if (amount > balances[msg.sender]) return false;
        
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Transfer(msg.sender, receiver, amount);
    }

    //Get my balance
    function getMyBalance() public view returns(uint256) {
        return balances[msg.sender];
    }

    function getBalance(address addr) public view returns(uint256) {
        return balances[addr];
    }

    //Withdraw tokens, be aware this would map a ATM. So the money withdrawed will be withdrawed from the account
    function withdraw(uint amount) public {
        require(balances[msg.sender] > amount);
        
        balances[msg.sender] -= amount;
    }

}