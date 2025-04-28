const request = require("supertest");
const { setupTestServer, closeTestServer } = require("./setupTestServer");
const Product = require("../models/Product");

let app;

beforeAll(async () => {
  app = await setupTestServer();
});

afterAll(async () => {
  await closeTestServer();
});

afterEach(async () => {
  await Product.deleteMany();
});

describe("Product API Integration Tests", () => {
  it("should create a new product via POST /product", async () => {
    const productData = {
      name: "Sprite",
      category: "Ital",
      price: 450,
      stock: 70,
    };

    const response = await request(app)
      .post("/product")
      .send(productData)
      .expect(201);

    expect(response.body).toHaveProperty("_id");
    expect(response.body.name).toBe(productData.name);
    expect(response.body.category).toBe(productData.category);
  });

  it("should get all product via GET /product/all", async () => {
    await Product.create({
      name: "Fanta",
      category: "Ital",
      price: 400,
      stock: 60,
    });

    const response = await request(app).get("/product/all").expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should update a product via PUT /product/:id", async () => {
    const product = await Product.create({
      name: "Csipsz",
      category: "Étel",
      price: 300,
      stock: 20,
    });

    const updatedData = {
      name: "Burgonya Chips",
      category: "Étel",
      price: 350,
      stock: 25,
    };

    const response = await request(app)
      .put(`/product/${product._id}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.name).toBe(updatedData.name);
    expect(response.body.price).toBe(updatedData.price);
  });

  it("should delete a product via DELETE /product/:id", async () => {
    const product = await Product.create({
      name: "Tej",
      category: "Étel",
      price: 250,
      stock: 40,
    });

    await request(app).delete(`/product/${product._id}`).expect(204);

    const found = await Product.findById(product._id);
    expect(found).toBeNull();
  });
});
