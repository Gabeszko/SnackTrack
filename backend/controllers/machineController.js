const machineService = require("../services/machineService");

// Összes automata
const getAllMachine = async (req, res) => {
  const result = await machineService.getAllMachine();
  if (result.status) {
    return res.status(200).json(result.data);
  } else {
    return res.status(400).json({ message: result.message });
  }
};

// Egy automata ID alapján
const getMachineById = async (req, res) => {
  const id = req.params.id;
  const result = await machineService.getMachineById(id);

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

// Automata szerkeztése
const updateMachine = async (req, res) => {
  const { id } = req.params;
  const { name, location, rows, cols, status } = req.body;

  const result = await machineService.updateMachine(id, {
    name,
    location,
    rows,
    cols,
    status,
  });

  if (result.status) {
    return res.status(200).json(result.data);
  } else {
    return res.status(400).json({ message: result.message });
  }
};

// Automata törlése
const deleteMachine = async (req, res) => {
  const { id } = req.params;

  const result = await machineService.deleteMachine(id);

  if (result.status) {
    return res.status(200).json({ message: result.message });
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
  updateMachine,
  deleteMachine,
};
