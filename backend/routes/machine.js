const express = require("express");
const router = express.Router();
const machineController = require("../controllers/machineController");

router.get("/all", machineController.getAllMachine);
router.get("/:id", machineController.getMachineById);
router.post("/", machineController.createMachine);
router.put("/:id", machineController.updateMachine);
router.delete("/:id", machineController.deleteMachine);
router.patch("/:machineId/slots/:slotCode", machineController.updateSlot);
router.put("/:id/refill", machineController.refillMachine);

module.exports = router;
