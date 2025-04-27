const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  slotCode: String,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    default: null,
  },
  quantity: Number,
  capacity: Number,
  price: Number,
});

const machineSchema = new mongoose.Schema({
  name: String,
  location: String,
  rows: Number,
  cols: Number,
  slots: [slotSchema],
  status: {
    type: String,
    enum: ["Active", "Maintenance", "Offline"],
    required: true,
    default: "Offline",
  },
  fullness: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Machine", machineSchema);
