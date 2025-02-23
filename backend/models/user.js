const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  timestamp: { type: Date, default: Date.now },
  reason: { type: String, required: true },
});

const policySchema = new mongoose.Schema({
  planName: { type: String, required: true },
  duration: { type: Number, required: true },
  amount: { type: Number, required: true },
  claims: [claimSchema],
});

const contributionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  cause: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  publicKey: { type: String, required: true },
  privateKey: { type: String, required: true },
  balance: { type: Number, default: 0 },
  accountId: { type: String },
  policies: [policySchema],
  contributions: [contributionSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
