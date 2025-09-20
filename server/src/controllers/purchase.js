import purchaseSweet from "../services/purchaseSweet.js";
import mongoose from "mongoose";

export const purchaseSweetController = async (req, res) => {
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
        error: "Purchase quantity is required" 
      });
    }

    if (typeof quantity !== "number" || isNaN(quantity)) {
      return res.status(400).json({ 
        error: "Purchase quantity must be a valid number" 
      });
    }

    if (!Number.isInteger(quantity)) {
      return res.status(400).json({ 
        error: "Purchase quantity must be a whole number" 
      });
    }

    const result = await purchaseSweet(sweetId, quantity);

    return res.status(200).json(result);
  } catch (error) {
    if (error.message.includes("Sweet not found")) {
      return res.status(404).json({ error: error.message });
    }

    if (error.message.includes("Purchase quantity must be greater than 0") ||
        error.message.includes("Insufficient stock available")) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};