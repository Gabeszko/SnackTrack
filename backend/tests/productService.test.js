const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Product = require("../models/Product");
const productService = require("../services/productService");

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
  await Product.deleteMany(); // Teszt után minden terméket törlünk
});

describe("productService", () => {
  it("should create a new product successfully", async () => {
    const input = {
      name: "Kóla",
      category: "Ital",
      price: 500,
      stock: 100,
    };

    const result = await productService.createProduct(input);

    expect(result.status).toBe(true);
    expect(result.data).toHaveProperty("_id");
    expect(result.data.name).toBe(input.name);
    expect(result.data.category).toBe(input.category);
  });

  it("should fetch all products", async () => {
    await Product.create({
      name: "Pepsi",
      category: "Ital",
      price: 400,
      stock: 50,
    });

    const result = await productService.getAllProducts();

    expect(result.status).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
  });

  it("should update a product", async () => {
    const product = await Product.create({
      name: "Chips",
      category: "Étel",
      price: 300,
      stock: 20,
    });

    const updateData = {
      name: "Csipsz",
      category: "Étel",
      price: 350,
      stock: 25,
    };
    const result = await productService.updateProduct(product._id, updateData);

    expect(result.status).toBe(true);
    expect(result.data.name).toBe(updateData.name);
  });

  it("should delete a product", async () => {
    const product = await Product.create({
      name: "Csoki",
      category: "Étel",
      price: 200,
      stock: 30,
    });

    const result = await productService.deleteProduct(product._id);

    expect(result.status).toBe(true);

    const found = await Product.findById(product._id);
    expect(found).toBeNull();
  });
});
