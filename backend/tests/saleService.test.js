const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Machine = require("../models/Machine");
const saleService = require("../services/saleService");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Sale.deleteMany();
  await Product.deleteMany();
});

describe("saleService", () => {
  it("should create a sale successfully and update product stock", async () => {
    const product = await Product.create({
      name: "Kóla",
      category: "Ital",
      price: 500,
      stock: 10,
    });

    const saleInput = {
      machineId: null, // Nem kötelező
      date: new Date().toISOString(),
      products: [
        {
          productId: product._id,
          quantity: 2,
          productProfit: 300,
        },
      ],
      allProfit: 600,
    };

    const result = await saleService.createSale(saleInput);

    expect(result.status).toBe(true);

    const updatedProduct = await Product.findById(product._id);
    expect(updatedProduct.stock).toBe(8); // 10 - 2 = 8
  });

  it("should fetch all sales", async () => {
    const product = await Product.create({
      name: "Fanta",
      category: "Ital",
      price: 400,
      stock: 50,
    });

    const savedProduct = await Product.findById(product._id); // plusz ellenőrzés

    await Sale.create({
      machineId: null,
      date: new Date().toISOString(),
      products: [
        {
          productId: savedProduct._id,
          quantity: 1,
          productProfit: 200,
        },
      ],
      allProfit: 200,
    });

    const result = await saleService.getAllSales();

    console.log(result); // ideiglenesen, hogy lásd a visszaadott választ!

    expect(result.status).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
  });
});
