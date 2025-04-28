const Machine = require("../models/Machine");
const Product = require("../models/Product");
const calculateFullness = require("../utils/calculateFullness");
const generateSlots = require("../utils/generateSlots");

// Összes automata lekérése
const getAllMachine = async () => {
  try {
    const data = await Machine.find().populate("slots.product");
    return { status: true, data: data };
  } catch (err) {
    return {
      status: false,
      message: "Összes automata lekérése hiba: " + err.message,
    };
  }
};

// Egy automata ID alapján
const getMachineById = async (id) => {
  try {
    const data = await Machine.findById(id).populate("slots.product");
    if (!data) {
      return { status: false, message: "Automata nem található" };
    }
    return { status: true, data };
  } catch (err) {
    return {
      status: false,
      message: "Egy automata ID alapján hiba: " + err.message,
    };
  }
};

// Automata létrehozása
const createMachine = async ({ name, location, rows, cols }) => {
  try {
    if (!name || !location || rows === undefined || cols === undefined) {
      return {
        status: false,
        message: "Hiányzó kötelező mezők az automata létrehozásához.",
      };
    }

    const slots = generateSlots(rows, cols);

    const newMachine = new Machine({
      name,
      location,
      rows,
      cols,
      slots,
      fullness: calculateFullness(slots),
    });

    const savedMachine = await newMachine.save();

    return { status: true, data: savedMachine };
  } catch (err) {
    return {
      status: false,
      message: "Nem sikerült létrehozni az automatát: " + err.message,
    };
  }
};

// Slot frissítése
const updateSlot = async ({
  machineId,
  slotCode,
  product,
  quantity,
  capacity,
  price,
}) => {
  try {
    const machine = await Machine.findById(machineId);
    if (!machine) {
      return { status: false, message: "Automata nem található" };
    }

    const slot = machine.slots.find((s) => s.slotCode === slotCode);
    if (!slot) {
      return { status: false, message: "Rekesz nem található" };
    }

    const oldProductId = slot.product;
    const oldCapacity = slot.capacity;

    // Slot frissítése
    slot.product = product;
    slot.quantity = quantity;
    slot.capacity = capacity;
    slot.price = price;

    // Fullness újraszámolása
    machine.fullness = calculateFullness(machine.slots);

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

    // Visszatérünk a frissített automatával
    const updatedMachine = await Machine.findById(machineId).populate(
      "slots.product"
    );

    return { status: true, data: updatedMachine };
  } catch (err) {
    return {
      status: false,
      message: "Hiba a slot frissítésekor: " + err.message,
    };
  }
};

// Automata teljes ujratöltése
const refillMachine = async (id) => {
  try {
    const machine = await Machine.findById(id);
    if (!machine) {
      return { status: false, message: "Automata nem található" };
    }

    machine.slots.forEach((slot) => {
      if (slot.product) {
        slot.quantity = slot.capacity;
      }
    });

    // Fullness újraszámolás
    machine.fullness = calculateFullness(machine.slots);

    await machine.save();

    const updatedMachine = await Machine.findById(id).populate("slots.product");

    return { status: true, data: updatedMachine };
  } catch (err) {
    return { status: false, message: "Hiba a feltöltés során: " + err.message };
  }
};

module.exports = {
  getAllMachine,
  getMachineById,
  createMachine,
  updateSlot,
  refillMachine,
};
