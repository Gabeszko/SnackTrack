const request = require("supertest");
const { setupTestServer, closeTestServer } = require("./setupTestServer");
const Sale = require("../models/Sale");
const Product = require("../models/Product");

let app;

beforeAll(async () => {
  app = await setupTestServer();
});

afterAll(async () => {
  await closeTestServer();
});

afterEach(async () => {
  await Sale.deleteMany();
  await Product.deleteMany();
});

describe("Sales API Integration Tests", () => {
  it("should create a new sale via POST /sales", async () => {
    const product = await Product.create({
      name: "Fanta",
      category: "Ital",
      price: 400,
      stock: 5,
    });

    const saleData = {
      machineId: null,
      date: new Date().toISOString(),
      products: [
        {
          productId: product._id,
          quantity: 2,
          productProfit: 200,
        },
      ],
      allProfit: 400,
    };

    const response = await request(app)
      .post("/sales")
      .send(saleData)
      .expect(201);

    expect(response.body).toHaveProperty("message");

    const updatedProduct = await Product.findById(product._id);
    expect(updatedProduct.stock).toBe(3); // 5 - 2
  });

  it("should get all sales via GET /sales", async () => {
    await Sale.create({
      machineId: null,
      date: new Date().toISOString(),
      products: [],
      allProfit: 0,
    });

    const response = await request(app).get("/sales").expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
