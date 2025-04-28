const saleService = require("../services/saleService");

const getAllSales = async (req, res) => {
  const result = await saleService.getAllSales();
  if (result.status) {
    return res.status(200).json(result.data);
  } else {
    return res.status(500).json({ message: result.message });
  }
};

const createSale = async (req, res) => {
  const { machineId, date, products, allProfit } = req.body;
  const result = await saleService.createSale({
    machineId,
    date,
    products,
    allProfit,
  });

  if (result.status) {
    return res.status(201).json({ message: result.message });
  } else {
    return res.status(500).json({ message: result.message });
  }
};

module.exports = {
  getAllSales,
  createSale,
};
