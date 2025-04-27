const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// POST new product
router.post('/', async (req, res) => {
  const { name, category, price, stock } = req.body;
  const newProduct = new Product({ name, category, price, stock });
  await newProduct.save();
  res.status(201).json(newProduct);
});

// DELETE product by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.status(204).send(); // nincs tartalom
  } catch (err) {
    res.status(500).json({ error: 'Hiba a törlés során' });
  }
});

// UPDATE product by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, price, stock } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, category, price, stock },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: 'Hiba a frissítés során' });
  }
});


module.exports = router;
