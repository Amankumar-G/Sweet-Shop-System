import { registerUser } from "../services/registration.js";

export const registerController = async (req, res) => {
  try {
    const userData = req.body;
    const result = await registerUser(userData); 
    return res.status(201).json(result);         
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
