const ethers = require('ethers');
const solc = require('solc');
const Contract = ethers.Contract;
const provider = ethers.getDefaultProvider('ropsten');
const fs = require('fs-extra');
const privateKey = '0x000000000000000000000000000000000000000000';

const bytecode = '0x' + fs.readFileSync('ArrayOfFacts_sol_ArrayOfFacts.bin').toString();

const abi = fs.readFileSync('ArrayOfFacts_sol_ArrayOfFacts.abi').toString();

let PRIVATE_KEY = privateKey;
let CONTRACT_ADDRESS = '0x4C7d67b560060b0FE97107442a1cA2A7b21E766F';

function readFile(fileName) {
    return fs.readFileSync(fileName, 'utf8');
}

function compileContract(fileName, contractName) {
    let contractStr = readFile(fileName);

    // Console.log of output.cotracts[] method returns "Undefined"
    let output = solc.compile(contractStr);
    //console.log("version = " + ethers.version);
    console.log(contractName);
    console.log("");
    console.log(contractStr);
    console.log("");
    console.log("bytecode = " + bytecode);
    console.log("");
    console.log("ABI = " + abi);
    console.log("");

    //return output.contracts[':' + contractName];
}
///////////////*** Improved Code ***///////////
// let code = readFile(fileName);
// let solcInput = {
//     language: "Solidity",
//     sources: {
//       contract: {
//         content: code
//       }
//     },
//     settings: {
//       optimizer: {
//         enabled: true
//       },
//       evmVersion: "byzantium",
//       outputSelection: {
//         "*": {
//           "": ["legacyAST", "ast"],
//           "*": [
//             "abi",
//             "evm.bytecode.object",
//             "evm.bytecode.sourceMap",
//             "evm.deployedBytecode.object",
//             "evm.deployedBytecode.sourceMap",
//             "evm.gasEstimates"
//           ]
//         }
//       }
//     }
// };
//
// solcInput = JSON.stringify(solcInput);
// const output = solc.compile(solcInput);
// return JSON.parse(output).contracts.contract[contractName];


// Console.log of compiledContract variable returns "Undefined"
const compiledContract = compileContract('./ArrayOfFacts.sol','ArrayOfFacts');
console.log(compiledContract);
console.log("");
console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv');
console.log("");
//const abi = compiledContract.interface;

(async () => {

  async function deployContract (fileName, contractName) {
        const wallet = new ethers.Wallet(privateKey, provider);
        //let bytecode = '0x' + Bytecode;
        //let abi = compiledContract.abi;

        const factory = new ethers.ContractFactory(abi, bytecode, wallet);

        const contract = await factory.deploy();
        CONTRACT_ADDRESS = contract.address;
        console.log('Transaction created: ');
        console.log("");
        console.log("Tranx Hash: " + contract.deployTransaction.hash);
        console.log("");
        console.log('----------------------------------');
        console.log('Wait for contract to be mined...');
        console.log('----------------------------------');
        console.log("");
        await contract.deployed();
  }

  async function addFact (fact) {
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
      const tranx = await contract.add(fact);
      console.log('----------------------------------');
      console.log('Wait for transaction to be mined...');
      console.log('----------------------------------');
      await tranx.wait();
      console.log('**********************************');
      console.log("");
      console.log('Transaction mined!');
      console.log("");
      return tranx;
  }

  async function getFact (index) {
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
        return await contract.getFact(index);
  }

  async function getFactsCount () {
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
        return contract.count().then(count => {
          console.log(ethers.utils.bigNumberify(count).toNumber());
        });
        return await contract.count();
  }

  await deployContract('./ArrayOfFacts.sol', 'ArrayOfFacts');
  console.log("");
  console.log('**********************************');
  console.log("");
  console.log('Contract mined!');
  console.log("");
  console.log('Contract address: ' + CONTRACT_ADDRESS);

  const fact = 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks';
  console.log('**********************************');
  console.log("");
  console.log('Adding fact...');
  console.log("");
  const transaction = await addFact(fact);
  console.log('Transaction: ');
  console.log(transaction);

  console.log('**********************************');
  console.log("");
  console.log('Getting fact...');
  console.log("");
  let index = 0;
  const factResult = await getFact(index);
  console.log("READ Transaction:");
  console.log(JSON.stringify(factResult));
  console.log("");
  console.log('Fact ' + ++index + ' : ' + factResult);
  console.log("");

  console.log('**********************************');
  console.log("");
  console.log('Counting facts...');
  const count = await getFactsCount();
  console.log('Number of facts: ' + ethers.utils.bigNumberify(count).toNumber());

})();
