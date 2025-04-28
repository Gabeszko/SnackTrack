const machineService = require("../services/machineService");

// Összes automata
const getAllMachine = async (req, res) => {
  const result = await machineService.getAll();
  if (result.status) {
    return res.status(200).json(result.data);
  } else {
    return res.status(400).json({ message: result.message });
  }
};

// Egy automata ID alapján
const getMachineById = async (req, res) => {
  const id = req.params.id;
  const result = await machineService.getById(id);

  if (result.status) {
    return res.status(200).json(result.data);
  } else {
    return res.status(404).json({ message: result.message });
  }
};

// Automata létrehozása
const createMachine = async (req, res) => {
  const { name, location, rows, cols } = req.body;

  const result = await machineService.createMachine({
    name,
    location,
    rows,
    cols,
  });

  if (result.status) {
    return res.status(201).json(result.data);
  } else {
    return res.status(400).json({ message: result.message });
  }
};

// Slot frissítése
const updateSlot = async (req, res) => {
  const { machineId, slotCode } = req.params;
  const { product, quantity, capacity, price } = req.body;

  const result = await machineService.updateSlot({
    machineId,
    slotCode,
    product,
    quantity,
    capacity,
    price,
  });

  if (result.status) {
    return res.status(200).json(result.data);
  } else {
    return res.status(400).json({ message: result.message });
  }
};

// Automata teljes ujratöltése
const refillMachine = async (req, res) => {
  const { id } = req.params;

  const result = await machineService.refillMachine(id);

  if (result.status) {
    return res.status(200).json(result.data);
  } else {
    return res.status(400).json({ message: result.message });
  }
};

module.exports = {
  getAllMachine,
  getMachineById,
  createMachine,
  updateSlot,
  refillMachine,
};
