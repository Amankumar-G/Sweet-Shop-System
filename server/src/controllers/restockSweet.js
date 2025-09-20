import restockSweet from "../services/restockSweet.js";
import mongoose from "mongoose";

export const restockSweetController = async (req, res) => {
  try {
    const { id: sweetId } = req.params;
    const { quantity } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(sweetId)) {
      return res.status(400).json({ 
        error: "Invalid sweet ID format" 
      });
    }

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({ 
        error: "Restock quantity is required" 
      });
    }

    if (typeof quantity !== "number" || isNaN(quantity)) {
      return res.status(400).json({ 
        error: "Restock quantity must be a valid number" 
      });
    }

    const result = await restockSweet(sweetId, quantity);

    return res.status(200).json(result);
  } catch (error) {
    if (error.message.includes("Sweet not found")) {
      return res.status(404).json({ error: error.message });
    }

    if (error.message.includes("Restock quantity must be greater than 0") ||
        error.message.includes("Quantity must be a positive integer")) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
  }
};