const solc = require("solc");
const fs = require("fs");

const source = fs.readFileSync("RiskPool.sol", "utf8");

const input = {
  language: "Solidity",
  sources: {
    "RiskPool.sol": { content: source },
  },
  settings: { outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } } },
};

const compiledContract = JSON.parse(solc.compile(JSON.stringify(input)));
const contractBytecode =
  compiledContract.contracts["RiskPool.sol"]["RiskPool"].evm.bytecode.object;
const contractABI = compiledContract.contracts["RiskPool.sol"]["RiskPool"].abi;

// Save compiled outputs
fs.writeFileSync("RiskPool_abi.json", JSON.stringify(contractABI, null, 2));
fs.writeFileSync("RiskPool_bytecode.bin", contractBytecode);

console.log("✅ Smart contract compiled successfully!");
