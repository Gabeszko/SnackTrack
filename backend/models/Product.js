const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  category: {
    type: String,
    enum: ["Ital", "Étel", "Egyéb"],
    required: true,
  },
  price: Number,
  stock: Number,
  allocatedCapacity: Number,
});
module.exports = mongoose.model("Product", productSchema);
