import Sale from "../models/Sale.js";

export const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("machineId", "name") // csak a gép nevét töltjük be
      .populate("products.productId", "name"); // termék nevét is betöltjük
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Hiba történt az adatok lekérésekor." });
  }
};
