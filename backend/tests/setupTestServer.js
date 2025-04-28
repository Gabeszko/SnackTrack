const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const machineRouter = require("../routes/machine");
const productRouter = require("../routes/product");
const saleRouter = require("../routes/sale");

let mongoServer;

const setupTestServer = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);

  const app = express();
  app.use(express.json());

  // API endpointok betöltése
  app.use("/machines", machineRouter);
  app.use("/product", productRouter);
  app.use("/sales", saleRouter);

  return app;
};

const closeTestServer = async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
};

module.exports = { setupTestServer, closeTestServer };
