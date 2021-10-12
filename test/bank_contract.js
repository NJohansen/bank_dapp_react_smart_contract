const BankContract = artifacts.require("BankContract");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("BankContract", function (accounts) {
  
  it("should deposit 10000 to the first account", () =>
  BankContract.deployed()
    .then(instance => instance.balances.call(accounts[0]))
    .then(balance => {
      assert.equal(
        balance.valueOf(),
        10000,
        "10000 wasn't in the first account"
      );
    }));
  
    //Try using async await
  it("should mint the right amount of coins", async function () {

    // Get the initial balances of first account.
    const account_one_address = accounts[1];
    let balance;
  
    //Amount to mint
    const amount = 1000;

    const instance = await BankContract.deployed();
    const bank = instance;

    //Get balance for account one
    balance = await bank.balances.call(account_one_address);
    const account_one_start_balance = balance.toNumber(); 

    //Mint amount coins to account_one_address
    let response = await bank.mint(account_one_address, amount);

    balance = await bank.balances.call(account_one_address);
    //Get new balance now where tokens are minted
    const account_one_end_balance = balance.toNumber(); 
    
    //Assert that the start balance is equal the balance after mint - the amount minted
    assert.equal(
      account_one_start_balance,
      account_one_end_balance - amount,
      "Mint amount was not added correctly"
    )
  });
});

