const Sale = require("../models/Sale");
const Product = require("../models/Product");

// Összes Sale lekérése
const getAllSales = async () => {
  try {
    const sales = await Sale.find()
      .populate("machineId", "name")
      .populate("products.productId", "name");
    return { status: true, data: sales };
  } catch (err) {
    return {
      status: false,
      message: "Eladások lekérése sikertelen: " + err.message,
    };
  }
};

// Sale létrehozása
const createSale = async ({ machineId, date, products, allProfit }) => {
  try {
    const newSale = new Sale({ machineId, date, products, allProfit });
    await newSale.save();

    for (const item of products) {
      const { productId, quantity } = item;
      if (
        !productId ||
        quantity <= 0 ||
        productId === "Nincs termék" ||
        productId === "Ismeretlen termék"
      ) {
        continue;
      }

      const product = await Product.findById(productId);
      if (product) {
        product.stock = Math.max(0, product.stock - quantity);
        await product.save();
      }
    }

    return { status: true, message: "Eladás rögzítve, készlet frissítve." };
  } catch (err) {
    return {
      status: false,
      message: "Eladás rögzítése sikertelen: " + err.message,
    };
  }
};

module.exports = {
  getAllSales,
  createSale,
};
