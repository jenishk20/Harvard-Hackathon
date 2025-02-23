const {
  ContractExecuteTransaction,
  ContractFunctionParameters,
  Hbar,
} = require("@hashgraph/sdk");
const { PrivateKey, PublicKey } = require("@hashgraph/sdk");
const client = require("../config/hederaClient");
const User = require("../models/user");

const contractId = "0.0.5615643";

const getContribution = async (req, res) => {
  try {
    const { userId } = req.query;

    console.log(`🚀 Getting contribution for user with ID: ${userId}`);

    const contractExecuteTx = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(100000)
      .setFunction(
        "getUserContribution",
        new ContractFunctionParameters().addString(userId)
      );

    const txResponse = await contractExecuteTx.execute(client);
    const receipt = await txResponse.getReceipt(client);

    res.json({
      status: "success",
      contribution: receipt.getString(0),
    });
  } catch (error) {
    console.error("Error in getContribution function:", error);
    res.status(500).json({ error: "Failed to get contribution" });
  }
};

const contribute = async (req, res) => {
  try {
    const { userAddress, userId, amount } = req.body;

    console.log(
      `🚀 User ${userAddress} is contributing ${amount} HBAR with ID: ${userId}`
    );

    const contractExecuteTx = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(100000)
      .setPayableAmount(new Hbar(amount))
      .setFunction(
        "contribute",
        new ContractFunctionParameters().addString(userId)
      );

    const txResponse = await contractExecuteTx.execute(client);
    const receipt = await txResponse.getReceipt(client);

    res.json({
      status: "success",
      transactionId: receipt.transactionId.toString(),
    });
  } catch (error) {
    console.error("Error in contribute function:", error);
    res.status(500).json({ error: "Failed to contribute" });
  }
};

const createWallet = async (req, res) => {
  console.log("Coming over here", req);
  try {
    const { userId } = req.body;
    const privateKey = PrivateKey.generate();
    const publicKey = privateKey.publicKey;

    const user = new User({
      uid: userId,
      publicKey: publicKey.toString(),
      privateKey: privateKey.toString(),
    });

    await user.save();

    res.status(200).json({
      status: "success",
      privateKey: privateKey.toString(),
      publicKey: publicKey.toString(),
    });
  } catch (error) {
    console.error("Error in createWallet function:", error);
    res.status(500).json({ error: "Failed to create wallet" });
  }
};

module.exports = { contribute, createWallet, getContribution };
