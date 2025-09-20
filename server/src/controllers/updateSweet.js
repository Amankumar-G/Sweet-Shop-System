import updateSweetService from '../services/updateSweet.js';
import mongoose from "mongoose";

export const updateSweetController = async (req, res) => {
  try {
     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      const error = new Error("Invalid sweet ID");
      error.name = "InvalidIdError";
      throw error;
    }
    const updatedSweet = await updateSweetService(req.params.id, req.body);
    res.status(200).json(updatedSweet);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ error: err.message });
    } else if (err.name === 'InvalidIdError') {
      res.status(400).json({ error: 'Invalid sweet ID' });
    } else if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Failed to update sweet: ' + err.message });
    }
  }
};
