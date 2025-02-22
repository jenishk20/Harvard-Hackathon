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

async function getPoolAmount() {
  console.log("🚀 Contributing to the Risk Pool...");

  const contractExecuteTx = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setFunction("getPoolBalance")
    .setGas(100000)
    .freezeWith(client);

  const contractSign = await contractExecuteTx.sign(operatorKey);
  const contractSubmit = await contractSign.execute(client);
  //   const result = await contractSubmit.getUint256(0);
  const contractReceipt = await contractSubmit.getReceipt(client);
  console.log(contractReceipt);

  console.log(`✅ Contribution successful! Status: ${contractReceipt.status}`);
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
  await getPoolAmount();
}

main().catch(console.error);
