import mongoose from 'mongoose';
import deleteSweet from '../services/deleteSweet.js';
export const deleteSweetController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid sweet ID' });
    }

    const deleted = await deleteSweet(id);
    res.status(200).json(deleted);
  } catch (err) {
    const status = err.message.includes('not found') ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
};
