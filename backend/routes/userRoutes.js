const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

console.log(userController);
router.post("/contribute", userController.contribute);
router.get("/getContribution", userController.getContribution);
router.post("/createWallet", userController.createWallet);

module.exports = router;
