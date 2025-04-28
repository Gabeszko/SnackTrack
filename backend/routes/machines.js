const generateSlots = require("../utils/generateSlots");
const express = require("express");
const router = express.Router();
const Machine = require("../models/Machine");
const Product = require("../models/Product");

// Machine fullnes calculation
function calculateFullness(slots) {
  const filled = slots.reduce(
    (acc, slot) => acc + (slot.product ? slot.quantity : 0),
    0
  );
  const total = slots.reduce(
    (acc, slot) => acc + (slot.product ? slot.capacity : 0),
    0
  );

  if (total === 0) return 0;
  return Math.round((filled / total) * 100); // százalékban kerekítve
}

// GET All Machines
router.get("/", async (req, res) => {
  const machines = await Machine.find().populate("slots.product");
  res.json(machines);
});

// GET /machines/:id
router.get("/:id", async (req, res) => {
  const machine = await Machine.findById(req.params.id).populate(
    "slots.product"
  );
  if (!machine) return res.status(404).json({ error: "Nem található" });
  res.json(machine);
});

// POST New Machine
router.post("/", async (req, res) => {
  const { name, location, rows, cols } = req.body;
  const slots = generateSlots(rows, cols);

  const fullness = calculateFullness(slots);

  const newMachine = new Machine({
    name,
    location,
    rows,
    cols,
    slots,
    fullness,
  });
  await newMachine.save();
  res.status(201).json(newMachine);
});

// PUT /machines/:id - Automata adatainak frissítése
/*
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, location, rows, cols, status } = req.body;

  try {
    const updatedMachine = await Machine.findByIdAndUpdate(
      id,
      { name, location, rows, cols, status },
      { new: true, runValidators: true }
    );
    if (!updatedMachine)
      return res.status(404).json({ error: "Automata nem található" });

    res.json(updatedMachine);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Hiba az automata frissítésekor", details: err.message });
  }
});
*/
// PUT /machines/:id - Automata adatainak frissítése
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, location, rows, cols, status } = req.body;

  try {
    const machine = await Machine.findById(id);
    if (!machine)
      return res.status(404).json({ error: "Automata nem található" });

    // Eredeti méret
    const oldRows = machine.rows;
    const oldCols = machine.cols;

    // Adatok frissítése
    machine.name = name;
    machine.location = location;
    machine.rows = rows;
    machine.cols = cols;
    machine.status = status;

    // Ha nőtt a rows vagy cols ➔ új slotokat kell generálni
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // Sorok bővítése
    if (rows > oldRows) {
      for (let r = oldRows; r < rows; r++) {
        for (let c = 1; c <= cols; c++) {
          machine.slots.push({
            slotCode: `${letters[r]}${c}`,
            product: null,
            quantity: 0,
            capacity: 0,
            price: 0,
          });
        }
      }
    }

    // Oszlopok bővítése
    if (cols > oldCols) {
      for (let r = 0; r < oldRows; r++) {
        for (let c = oldCols + 1; c <= cols; c++) {
          machine.slots.push({
            slotCode: `${letters[r]}${c}`,
            product: null,
            quantity: 0,
            capacity: 0,
            price: 0,
          });
        }
      }
    }

    // Fullness újraszámolása
    machine.fullness = calculateFullness(machine.slots);

    await machine.save();

    res.json(machine);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Hiba az automata frissítésekor", details: err.message });
  }
});

// DELETE Machine
router.delete("/:id", async (req, res) => {
  try {
    const deletedMachine = await Machine.findByIdAndDelete(req.params.id);
    if (!deletedMachine)
      return res.status(404).json({ error: "Automata nem található" });
    res.json({ message: "Automata törölve" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Hiba történt a törlés során", details: err.message });
  }
});

// PATCH Slot Edit
router.patch("/:machineId/slots/:slotCode", async (req, res) => {
  const { machineId, slotCode } = req.params;
  const { product, quantity, capacity, price } = req.body;
  console.log("PATCH érkezett:", {
    machineId,
    slotCode,
    product,
    quantity,
    capacity,
    price,
  });

  try {
    const machine = await Machine.findById(machineId);
    if (!machine)
      return res.status(404).json({ error: "Automata nem található" });

    const slot = machine.slots.find((s) => s.slotCode === slotCode);
    if (!slot) return res.status(404).json({ error: "Rekesz nem található" });

    const oldProductId = slot.product;
    const oldCapacity = slot.capacity;

    // Slot frissítése
    slot.product = product;
    slot.quantity = quantity;
    slot.capacity = capacity;
    slot.price = price;

    // Fullness újraszámolása
    machine.fullness = calculateFullness(machine.slots);

    // Mentés előtt productok kezelése
    await machine.save();

    // Régi termék allocatedCapacity csökkentése
    if (oldProductId && oldCapacity) {
      await Product.findByIdAndUpdate(oldProductId, {
        $inc: { allocatedCapacity: -oldCapacity },
      });
    }

    // Új termék allocatedCapacity növelése
    if (product && capacity) {
      await Product.findByIdAndUpdate(product, {
        $inc: { allocatedCapacity: capacity },
      });
    }

    // Válasz visszaadása
    const updatedMachine = await Machine.findById(machineId).populate(
      "slots.product"
    );
    res.json(updatedMachine);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Hiba a slot frissítésekor", details: err.message });
  }
});

// PUT /machines/:id/refill - Refill all slots to capacity
router.put("/:id/refill", async (req, res) => {
  try {
    const machineId = req.params.id;

    // Find the machine
    const machine = await Machine.findById(machineId);
    if (!machine)
      return res.status(404).json({ error: "Automata nem található" });

    // Update each slot's quantity to match its capacity
    machine.slots.forEach((slot) => {
      if (slot.product) {
        slot.quantity = slot.capacity;
      }
    });

    // Save the updated machine
    await machine.save();

    // Return the updated machine with populated product data
    const updatedMachine = await Machine.findById(machineId).populate(
      "slots.product"
    );
    res.json(updatedMachine);
  } catch (err) {
    console.error("Hiba a feltöltés során:", err);
    res
      .status(500)
      .json({ error: "Hiba a feltöltés során", details: err.message });
  }
});

module.exports = router;
