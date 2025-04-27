const express = require("express");
const router = express.Router();
const machineController = require("../controllers/machineController");

router.get("/all", machineController.getAll);

module.exports = router;
