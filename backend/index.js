const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/products");
const machineRoutes = require("./routes/machines");
const salesRoutes = require("./routes/sales");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api/sales", salesRoutes);

const machineRoute = require("./routes/machine");
app.use("/machine", machineRoute);

app.get("/", (req, res) => {
  res.send("SnackTrack API működik 🚀");
});

mongoose
  .connect("mongodb://localhost:27017/vending", {})
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () =>
      console.log("Server running on http://localhost:5000")
    );
  })
  .catch((err) => console.error(err));
