const Product = require("../models/Product");

// Összes Product lekérése
const getAllProducts = async () => {
  try {
    const products = await Product.find();
    return { status: true, data: products };
  } catch (err) {
    return {
      status: false,
      message: "Termékek lekérése sikertelen: " + err.message,
    };
  }
};

// Product létrehozása
const createProduct = async ({ name, category, price, stock }) => {
  try {
    const newProduct = new Product({ name, category, price, stock });
    const savedProduct = await newProduct.save();
    return { status: true, data: savedProduct };
  } catch (err) {
    return {
      status: false,
      message: "Termék létrehozása sikertelen: " + err.message,
    };
  }
};

// Product Törlése
const deleteProduct = async (id) => {
  try {
    await Product.findByIdAndDelete(id);
    return { status: true };
  } catch (err) {
    return {
      status: false,
      message: "Termék törlése sikertelen: " + err.message,
    };
  }
};

// Product szerkeztése/változtatása
const updateProduct = async (id, { name, category, price, stock }) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, category, price, stock },
      { new: true }
    );
    return { status: true, data: updatedProduct };
  } catch (err) {
    return {
      status: false,
      message: "Termék frissítése sikertelen: " + err.message,
    };
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProduct,
};
