require("dotenv").config();
const { Client, PrivateKey } = require("@hashgraph/sdk");

const operatorId = process.env.HEDERA_ACCOUNT_ID;
const operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);

if (!operatorId || !operatorKey) {
  throw new Error("Hedera credentials are missing in .env");
}

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

module.exports = client;
