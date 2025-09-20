import express from "express";
import Sweet from "../models/Sweet.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Optional: Clear existing data first
    await Sweet.deleteMany();

    const initialSweets = [
      { name: "Chocolate Bar", category: "Chocolate", price: 2.5, quantity: 50 },
      { name: "Candy Stick", category: "Candy", price: 1.0, quantity: 100 },
      { name: "Pastry Roll", category: "Pastry", price: 3.0, quantity: 30 },
      { name: "Almond Crunch", category: "Nut-Based", price: 4.5, quantity: 25 },
      { name: "Milk Fudge", category: "Milk-Based", price: 3.5, quantity: 40 },
      { name: "Caramel Delight", category: "Candy", price: 2.0, quantity: 60 },
      { name: "Chocolate Truffle", category: "Chocolate", price: 5.0, quantity: 20 },
      { name: "Vegetable Candy", category: "Vegetable-Based", price: 1.5, quantity: 70 },
      { name: "Peanut Brittle", category: "Nut-Based", price: 3.0, quantity: 35 },
      { name: "Cream Pastry", category: "Pastry", price: 4.0, quantity: 25 },
      { name: "White Chocolate", category: "Chocolate", price: 3.5, quantity: 30 },
      { name: "Hazelnut Delight", category: "Nut-Based", price: 4.0, quantity: 20 },
      { name: "Milk Caramel", category: "Milk-Based", price: 2.5, quantity: 50 },
      { name: "Spinach Candy", category: "Vegetable-Based", price: 1.8, quantity: 60 },
    ];

    const inserted = await Sweet.insertMany(initialSweets);

    res.status(200).json({
      message: "Database initialized successfully",
      count: inserted.length,
      data: inserted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to initialize database" });
  }
});

export default router;
