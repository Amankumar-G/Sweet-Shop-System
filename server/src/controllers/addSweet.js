import addSweetService from '../services/addSweet.js';

export const addSweetController = async (req, res) => {
  try {
    const sweet = await addSweetService(req.body);
    res.status(201).json(sweet);
  } catch (err) {
    const status = err.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
};
