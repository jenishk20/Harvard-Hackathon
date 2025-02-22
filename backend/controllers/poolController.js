const {
  ContractCallQuery,
  ContractFunctionParameters,
} = require("@hashgraph/sdk");
const client = require("../config/hederaClient");

const contractId = "0.0.5615643";

exports.getPoolBalance = async (req, res) => {
  try {
    console.log("🚀 Fetching pool balance...");

    const contractCallQuery = new ContractCallQuery()
      .setContractId(contractId)
      .setGas(100000)
      .setFunction("getPoolBalance", new ContractFunctionParameters());

    const contractSubmit = await contractCallQuery.execute(client);
    const poolBalance = contractSubmit.getUint256(0);

    console.log(`Pool Balance: ${poolBalance}`);
    res.json({ poolBalance });
  } catch (error) {
    console.error("Error fetching pool balance:", error);
    res.status(500).json({ error: "Failed to fetch pool balance" });
  }
};
