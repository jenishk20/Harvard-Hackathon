require("dotenv").config();
const {
  Client,
  PrivateKey,
  FileCreateTransaction,
  ContractCreateTransaction,
  Hbar,
} = require("@hashgraph/sdk");
const fs = require("fs");

const operatorId = process.env.HEDERA_ACCOUNT_ID;
const operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

const bytecode = fs.readFileSync("RiskPool_bytecode.bin");

async function deployContract() {
  console.log("🚀 Uploading bytecode to Hedera File Service...");

  const fileCreateTx = new FileCreateTransaction()
    .setContents(bytecode)
    .setKeys([operatorKey])
    .setMaxTransactionFee(new Hbar(2))
    .freezeWith(client);

  const fileCreateSign = await fileCreateTx.sign(operatorKey);
  const fileCreateSubmit = await fileCreateSign.execute(client);
  const fileCreateReceipt = await fileCreateSubmit.getReceipt(client);
  const bytecodeFileId = fileCreateReceipt.fileId;

  console.log(`✅ Bytecode uploaded to File ID: ${bytecodeFileId}`);

  console.log("🚀 Deploying smart contract...");

  const contractTx = new ContractCreateTransaction()
    .setBytecodeFileId(bytecodeFileId) // Use uploaded file ID
    .setGas(5000000) // Gas Limit
    .setAdminKey(operatorKey) // Set admin key
    .setMaxTransactionFee(new Hbar(10)) // Max fee
    .freezeWith(client);

  const contractSign = await contractTx.sign(operatorKey);
  const contractSubmit = await contractSign.execute(client);
  const contractReceipt = await contractSubmit.getReceipt(client);
  const contractId = contractReceipt.contractId;

  console.log(`✅ Smart contract deployed! Contract ID: ${contractId}`);
}

deployContract().catch(console.error);
