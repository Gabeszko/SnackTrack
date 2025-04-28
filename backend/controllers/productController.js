const productService = require("../services/productService");

const getAllProducts = async (req, res) => {
  const result = await productService.getAllProducts();
  if (result.status) {
    return res.status(200).json(result.data);
  } else {
    return res.status(500).json({ message: result.message });
  }
};

const createProduct = async (req, res) => {
  const { name, category, price, stock } = req.body;
  const result = await productService.createProduct({
    name,
    category,
    price,
    stock,
  });

  if (result.status) {
    return res.status(201).json(result.data);
  } else {
    return res.status(400).json({ message: result.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const result = await productService.deleteProduct(id);

  if (result.status) {
    return res.status(204).send(); // no content
  } else {
    return res.status(500).json({ message: result.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, price, stock } = req.body;
  const result = await productService.updateProduct(id, {
    name,
    category,
    price,
    stock,
  });

  if (result.status) {
    return res.status(200).json(result.data);
  } else {
    return res.status(500).json({ message: result.message });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProduct,
};
