const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
  planName: { type: String, required: true },
  duration: { type: Number, required: true },
  amount: { type: Number, required: true },
});

module.exports = policySchema;

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  publicKey: { type: String, required: true },
  privateKey: { type: String, required: true },
  balance: { type: Number, default: 0 },
  accountId: { type: String },
  policies: [policySchema],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
