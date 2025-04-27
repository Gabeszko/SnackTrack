const machineService = require("../services/machineService");

const getAll = async (req, res) => {
  const result = await machineService.getAll();

  if (result.status) {
    return res.status(200).json(result.data);
  } else {
    return res.status(400).json({ message: result.message });
  }
};

module.exports = { getAll };
