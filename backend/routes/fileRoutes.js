const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
router.post("/extractData", upload.single("file"), fileController.extractData);

module.exports = router;
