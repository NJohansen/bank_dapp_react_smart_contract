# A demo of a Bank DApp written with Solidity and React
It is a small bank application with balance information, deposit and withdrawal functionality.
The React application uses web3 to communicate with the private ethereum network.

# Installation 
Run the development console. I use truffle for this.
```
truffle develop
```

Compile and migrate the smart contracts. Note inside the development console we don't preface commands with truffle.
```
compile
migrate
```
In the client directory, we run the React app. Smart contract changes must be manually recompiled and migrated.

// in another terminal (i.e. not in the truffle develop prompt)
```
cd client
npm run start
```
There are tests for the minting functionality. Truffle can run tests written in Solidity or JavaScript against your smart contracts. Note the command varies slightly if you're in or outside of the development console.

// inside the truffle development console.
```
test
```

// outside the development console..
```
truffle test
```

Feel free to use it.
