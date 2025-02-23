const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
  policyId: { type: String, required: true },
  sumInsured: { type: Number, required: true },
  premiumAmount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  amountClaimed: { type: Number, default: 0 },
  claimLimitReached: { type: Boolean, default: false },
  transactions: [
    {
      transactionId: { type: String, required: true },
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  status: {
    type: String,
    enum: ["active", "expired", "cancelled", "completed"],
    default: "active",
  },
});

policySchema.pre("save", function (next) {
  if (this.amountClaimed >= this.sumInsured) {
    this.status = "completed";
    this.claimLimitReached = true;
  }
  next();
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
