import React, { Component } from "react";
import BankContract from "./contracts/BankContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, balances: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = BankContract.networks[networkId];
      const instance = new web3.eth.Contract(
        BankContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getMyBalance().call();
    let balanceresult = await Promise.all (accounts.map(async (account) => {
      return await contract.methods.getBalance(account).call();
    } ) );
    
    // Update state with the result.
    this.setState({ storageValue: response, balances: balanceresult });
  };

  render() {
    let { balances, accounts, contract } = this.state;

    const onClickDeposit =  async () => {
      //Remember to use send() when we alter chain data. But also use from 
      contract.methods.deposit(accounts[1], 10).send({from : accounts[0]});
      
      this.setState({}, this.runExample)
    }

    const onClickWithdraw = async () => {
      contract.methods.withdraw(150).send({from : accounts[0]});
      this.setState({}, this.runExample);
    }

    const renderBalance = (index) => {
      if (balances) {
        return <p>Balance: {balances[index]} ETH</p>;
      } else {
        return <p>finding balance</p>;
      }
    }

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App bg-gray-100">
        <div className="md:flex md:items-center md:justify-between max-w-3xl mx-auto p-8">
          <div className="flex-1 min-w-0 mb-6">
            <h2 className="text-left stext-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Accounts in network</h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button" onClick={onClickDeposit}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
              Deposit 10 ETH
            </button>
            <button
              type="button" onClick={onClickWithdraw}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Withdraw 150 ETH
            </button>
          </div>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md max-w-3xl m-auto">
          <ul role="list" className="divide-y divide-gray-200">
            {accounts.map((account, index) => (
              <li key={index}>
                <a href="#" className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">Account {index}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {account}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        {renderBalance(index)}
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
