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

module.exports = mongoose.model("Machine", slotSchema);
