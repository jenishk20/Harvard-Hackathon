const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  publicKey: { type: String, required: true },
  privateKey: { type: String, required: true },
  balance: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
