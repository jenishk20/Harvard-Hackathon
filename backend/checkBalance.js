const {
  Client,
  PrivateKey,
  ContractCallQuery,
  ContractId,
  Hbar,
  ContractFunctionParameters,
} = require("@hashgraph/sdk");
require("dotenv").config();

const operatorId = process.env.HEDERA_ACCOUNT_ID;
const operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

const contractId = "0.0.5615643";

async function getPoolAmount() {
  console.log("🚀 Getting the pool balance...");

  const contractCallQuery = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction("getPoolBalance", new ContractFunctionParameters());
  const contractSubmit = await contractCallQuery.execute(client);

  const poolBalance = contractSubmit.getUint256(0);

  console.log(`Pool Balance: ${poolBalance}`);
}

async function main() {
  await getPoolAmount();
}

main().catch(console.error);
