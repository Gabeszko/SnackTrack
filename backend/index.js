const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const machineRoute = require("./routes/machine");
const productRoute = require("./routes/product");
const salesRoute = require("./routes/sale");

app.use(cors());
app.use(express.json());

app.use("/machine", machineRoute);
app.use("/product", productRoute);
app.use("/sales", salesRoute);

app.get("/", (req, res) => {
  res.send("SnackTrack API működik");
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
