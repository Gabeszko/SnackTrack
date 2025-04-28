const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema({
  machineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Machine",
    default: null,
  },
  date: { type: String, required: true },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: null,
      },
      quantity: { type: Number, required: true },
      productProfit: { type: Number, required: true },
    },
  ],
  allProfit: { type: Number, required: true },
});

module.exports = mongoose.model("Sale", SaleSchema);
