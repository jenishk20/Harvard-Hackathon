const {
  Client,
  PrivateKey,
  ContractExecuteTransaction,
  ContractId,
  Hbar,
} = require("@hashgraph/sdk");
require("dotenv").config();

const operatorId = process.env.HEDERA_ACCOUNT_ID;
const operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

const contractId = "0.0.5615536";

async function contributeToRiskPool(amount) {
  console.log("🚀 Contributing to the Risk Pool...");

  const contractExecuteTx = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setFunction("contribute")
    .setPayableAmount(new Hbar(amount)) // Send the correct amount of HBAR
    .setGas(100000) // You might need to increase this if the contract is complex
    .freezeWith(client);

  const contractSign = await contractExecuteTx.sign(operatorKey);
  const contractSubmit = await contractSign.execute(client);
  const contractReceipt = await contractSubmit.getReceipt(client);

  console.log(`✅ Contribution successful! Status: ${contractReceipt.status}`);
}

async function getPoolAmount() {
  console.log("🚀 Getting the pool balance...");

  // Using ContractCallQuery to call a view function
  const contractCallQuery = new ContractCallQuery()
    .setContractId(contractId)
    .setFunction("getPoolBalance")
    .setGas(100000) // You can adjust the gas if necessary
    .freezeWith(client);

  const contractSubmit = await contractCallQuery.execute(client);

  // Get the result of the query (in this case, it's a uint256)
  const poolBalance = contractSubmit.getUint256(0);

  console.log(`Pool Balance: ${poolBalance}`);
}

async function requestClaim(amount) {
  console.log("🚀 Requesting claim...");

  const contractExecuteTx = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setFunction("requestClaim", [amount])
    .setGas(1000000)
    .freezeWith(client);

  const contractSign = await contractExecuteTx.sign(operatorKey);
  const contractSubmit = await contractSign.execute(client);
  const contractReceipt = await contractSubmit.getReceipt(client);

  console.log(`✅ Claim requested! Status: ${contractReceipt.status}`);
}

async function main() {
  await contributeToRiskPool(10);
}

main().catch(console.error);
