const request = require("supertest");
const { setupTestServer, closeTestServer } = require("./setupTestServer");
const Machine = require("../models/Machine");

let app;

beforeAll(async () => {
  app = await setupTestServer();
});

afterAll(async () => {
  await closeTestServer();
});

afterEach(async () => {
  await Machine.deleteMany();
});

describe("Machine API Integration Tests", () => {
  it("should create a new machine via POST /machines", async () => {
    const machineData = {
      name: "Teszt automata",
      location: "Földszint",
      rows: 2,
      cols: 2,
      stat: "Offline",
    };

    const response = await request(app)
      .post("/machines")
      .send(machineData)
      .expect(201);

    expect(response.body).toHaveProperty("_id");
    expect(response.body.name).toBe(machineData.name);
    expect(response.body.location).toBe(machineData.location);
    expect(response.body.rows).toBe(machineData.rows);
    expect(response.body.cols).toBe(machineData.cols);
    expect(response.body.stat).toBe(machineData.stat);
    expect(response.body.slots.length).toBe(4); // 2x2 slot
  });

  it("should return 400 if missing required fields", async () => {
    const machineData = {
      name: "Hiányos automata",
      // location, rows, cols hiányzik
    };

    const response = await request(app)
      .post("/machines")
      .send(machineData)
      .expect(400);

    expect(response.body).toHaveProperty("message");
  });
});
