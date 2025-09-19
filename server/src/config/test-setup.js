import mongoose from "mongoose";
import dotenv from "dotenv";
import db from "./mongodb.js";
dotenv.config();

beforeAll(async () => {
  await db.connectDB();
  console.log("Connected to test database");
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await db.disconnectDB();
  console.log("Disconnected test database");
});

beforeEach(() => {
  jest.clearAllMocks();
});
