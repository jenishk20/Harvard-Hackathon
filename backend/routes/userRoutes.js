const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/contribute", userController.contribute);
router.get("/getContribution", userController.getContribution);
router.post("/createWallet", userController.createWallet);
router.get("/getBalance", userController.getBalance);

module.exports = router;
