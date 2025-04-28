const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Machine = require("../models/Machine");
const machineService = require("../services/machineService");

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
  await Machine.deleteMany(); // tesztek után gépek törlése
});

describe("machineService.createMachine", () => {
  it("should create a new machine successfully", async () => {
    const input = {
      name: "Teszt Automata",
      location: "Első emelet",
      rows: 3,
      cols: 3,
    };

    const result = await machineService.createMachine(input);

    expect(result.status).toBe(true);
    expect(result.data).toHaveProperty("_id");
    expect(result.data.name).toBe(input.name);
    expect(result.data.location).toBe(input.location);
    expect(result.data.rows).toBe(input.rows);
    expect(result.data.cols).toBe(input.cols);
    expect(result.data.slots.length).toBe(9); // 3x3 slot
  });

  it("should fail if required fields are missing", async () => {
    const input = { name: "Hiányos Automata" };

    const result = await machineService.createMachine(input);

    expect(result.status).toBe(false);
    expect(result.message).toMatch(/Hiányzó kötelező mezők/);
  });
});
