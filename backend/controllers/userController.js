const {
  ContractExecuteTransaction,
  ContractFunctionParameters,
  Hbar,
} = require("@hashgraph/sdk");
const client = require("../config/hederaClient");

const contractId = "0.0.5615643";

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

module.exports = { contribute };
