const express = require("express");
const router = express.Router();
const poolController = require("../controllers/poolController");

router.get("/balance", poolController.getPoolBalance);

module.exports = router;
