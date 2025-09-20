import viewAllSweets from '../services/viewAllSweets.js';


export const viewSweetController = async (req, res) => {
  try {
    const sweets = await viewAllSweets();
    res.status(200).json(sweets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
