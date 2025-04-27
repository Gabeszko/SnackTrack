const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const Product = require("../models/Product");
//import { getAllSales } from "../controllers/salesController.js";
//const Machine = require("../models/Machine");

// GET All Sales
//router.get("/", getAllSales);

/*
router.get("/", async (req, res) => {
  const sales = await Sale.find();
  res.json(sales);
});
*/

router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("machineId", "name")
      .populate("products.productId", "name"); // products tömbön belül productId populate
    res.json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ error: "Failed to fetch sales" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { machineId, date, products, allProfit } = req.body;

    // Create and save the sale record
    const newSale = new Sale({
      machineId,
      date,
      products,
      allProfit,
    });

    await newSale.save();

    // Update product stock for each sold product
    for (const item of products) {
      const { productId, quantity } = item;

      // Skip if no productId (empty slot) or quantity is 0
      if (
        !productId ||
        quantity <= 0 ||
        productId === "Nincs termék" ||
        productId === "Ismeretlen termék"
      ) {
        continue;
      }

      // Update product stock
      const product = await Product.findById(productId);
      if (product) {
        product.stock = Math.max(0, product.stock - quantity); // Prevent negative stock
        await product.save();
      }
    }

    res
      .status(201)
      .json({ message: "Sale recorded successfully and stock updated." });
  } catch (error) {
    console.error("Error recording sale:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
