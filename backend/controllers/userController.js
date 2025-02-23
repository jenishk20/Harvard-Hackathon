const {
  ContractExecuteTransaction,
  ContractFunctionParameters,
  Hbar,
  AccountId,
  TransferTransaction,
  AccountCreateTransaction,
} = require("@hashgraph/sdk");
const { PrivateKey, PublicKey } = require("@hashgraph/sdk");
const client = require("../config/hederaClient");
const User = require("../models/user");

const contractId = "0.0.5615643";
const mainAccountId = process.env.HEDERA_ACCOUNT_ID;

const releaseClaim = async (req, res) => {
  try {
    const { userId, policyId, amount } = req.body;
    const userDetails = await User.findOne({ uid: userId });
    if (!userDetails) {
      return res.status(404).json({ error: "User not found" });
    }

    const policy = userDetails.policies.find((p) => p.policyId === policyId);
    if (!policy) {
      return res.status(404).json({ error: "Policy not found" });
    }

    if (policy.status !== "active") {
      return res.status(400).json({ error: "Policy is not active" });
    }

    const totalClaimedAmount = (policy.amountClaimed || 0) + amount;
    if (totalClaimedAmount > policy.sumInsured) {
      return res.status(400).json({ error: "Claim exceeds sum insured" });
    }

    const userAccountId = userDetails.accountId;

    const txTransfer = await new TransferTransaction()
      .addHbarTransfer(mainAccountId, new Hbar(-amount))
      .addHbarTransfer(userAccountId, new Hbar(amount))
      .freezeWith(client);

    const signedTx = await txTransfer.sign(mainAccountPrivateKey);

    const transferTxResponse = await signedTx.execute(client);
    const transferReceipt = await transferTxResponse.getReceipt(client);

    if (transferReceipt.status._code === 22) {
      userDetails.balance += amount;
      policy.amountClaimed = totalClaimedAmount;
      if (policy.amountClaimed >= policy.sumInsured) {
        policy.status = "completed";
      }

      await userDetails.save();

      res.status(200).json({
        status: "success",
        message: `${amount} HBAR successfully transferred to the user wallet`,
        transactionId: transferReceipt.transactionId.toString(),
        balance: userDetails.balance,
        policyStatus: policy.status,
        totalClaimed: policy.amountClaimed,
      });
    } else {
      res.status(500).json({ error: "Failed to transfer HBAR" });
    }
  } catch (error) {
    console.error("Error in releaseClaim function:", error);
    res.status(500).json({ error: "Failed to release claim" });
  }
};

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
    const { userId, amount } = req.body;

    const userDetails = await User.findOne({ uid: userId });
    const userAccountId = userDetails.accountId;
    const userPrivateKey = PrivateKey.fromString(userDetails.privateKey);
    const txTransfer = new TransferTransaction()
      .addHbarTransfer(userAccountId, new Hbar(-amount))
      .addHbarTransfer(mainAccountId, new Hbar(amount));

    txTransfer.freezeWith(client);
    const signedTx = await txTransfer.sign(userPrivateKey);
    const transferTxResponse = await signedTx.execute(client);
    const transferReceipt = await transferTxResponse.getReceipt(client);

    if (transferReceipt.status._code !== 22) {
      res.status(500).json({ error: "Failed to transfer HBAR" });
      return;
    }
    userDetails.balance -= amount;
    await userDetails.save();
    res.json({
      status: "success",
    });
  } catch (error) {
    console.error("Error in contribute function:", error);
    res.status(500).json({ error: "Failed to contribute" });
  }
};

const createWallet = async (req, res) => {
  try {
    const { userId } = req.body;
    const privateKey = PrivateKey.generate();
    const publicKey = privateKey.publicKey;

    const user = new User({
      uid: userId,
      publicKey: publicKey.toString(),
      privateKey: privateKey.toString(),
    });

    const accountCreateTx = new AccountCreateTransaction()
      .setKey(publicKey)
      .setInitialBalance(new Hbar(0));

    await user.save();

    const txResponse = await accountCreateTx.execute(client);
    const receipt = await txResponse.getReceipt(client);

    const userAccountId = receipt.accountId.toString();

    user.accountId = userAccountId;
    await user.save();

    const txTransfer = new TransferTransaction()
      .addHbarTransfer(mainAccountId, new Hbar(-2))
      .addHbarTransfer(userAccountId, new Hbar(2));

    const transferTxResponse = await txTransfer.execute(client);
    const transferReceipt = await transferTxResponse.getReceipt(client);

    if (transferReceipt.status._code === 22) {
      user.balance += 2;
      await user.save();

      res.status(200).json({
        status: "success",
        privateKey: privateKey.toString(),
        publicKey: publicKey.toString(),
        message: "2 HBAR successfully transferred to the new wallet",
      });
    } else {
      res.status(500).json({ error: "Failed to transfer HBAR" });
    }
  } catch (error) {
    console.error("Error in createWallet function:", error);
    res
      .status(500)
      .json({ error: "Failed to create wallet and transfer HBAR" });
  }
};

const getBalance = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findOne({ uid : userId });
    const balance = user?.balance || 0;
    res.json({ status: "success", balance });
  } catch (error) {
    console.error("Error in getBalance function:", error);
    res.status(500).json({ error: "Failed to get balance" });
  }
};

const investInPolicy = async (req, res) => {
  try {
    const { userId, policyId, amount } = req.body;
    const userDetails = await User.findOne({ uid: userId });
    if (!userDetails) {
      return res.status(404).json({ error: "User not found" });
    }

    const policy = userDetails.policies.find((p) => p.policyId === policyId);
    if (!policy) {
      return res.status(404).json({ error: "Policy not found" });
    }

    if (policy.status !== "active") {
      return res.status(400).json({ error: "Policy is not active" });
    }

    const totalClaimedAmount = (policy.amountClaimed || 0) + amount;
    if (totalClaimedAmount > policy.sumInsured) {
      return res.status(400).json({ error: "Claim exceeds sum insured" });
    }

    const userAccountId = userDetails.accountId;

    const txTransfer = await new TransferTransaction()
      .addHbarTransfer(userAccountId, new Hbar(-amount))
      .addHbarTransfer(mainAccountId, new Hbar(amount))
      .freezeWith(client);

    const signedTx = await txTransfer.sign(mainAccountPrivateKey);

    const transferTxResponse = await signedTx.execute(client);
    const transferReceipt = await transferTxResponse.getReceipt(client);

    if (transferReceipt.status._code === 22) {
      userDetails.balance -= amount;
      policy.amountClaimed = totalClaimedAmount;
      policy.sumInsured += amount;
      if (policy.amountClaimed >= policy.sumInsured) {
        policy.status = "completed";
      }

      await userDetails.save();

      res.status(200).json({
        status: "success",
        message: `${amount} HBAR successfully transferred to the user wallet`,
        transactionId: transferReceipt.transactionId.toString(),
        balance: userDetails.balance,
        policyStatus: policy.status,
        totalClaimed: policy.amountClaimed,
      });
    }
  } catch (error) {
    console.error("Error in investInPolicy function:", error);
    res.status(500).json({ error: "Failed to transfer HBAR" });
  }
};

module.exports = {
  contribute,
  createWallet,
  getContribution,
  getBalance,
  releaseClaim,
  investInPolicy,
};
