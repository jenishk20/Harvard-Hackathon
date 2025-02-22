const {
  Client,
  PrivateKey,
  ContractCallQuery,
  ContractId,
  Hbar,
} = require("@hashgraph/sdk");
require("dotenv").config();

const operatorId = process.env.HEDERA_ACCOUNT_ID;
const operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

const contractId = "0.0.5615536";

async function getPoolAmount() {
  console.log("🚀 Getting the pool balance...");

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

async function main() {
  await getPoolAmount();
}

main().catch(console.error);
