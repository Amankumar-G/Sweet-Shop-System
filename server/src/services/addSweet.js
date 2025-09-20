import Sweet from '../models/Sweet.js';

const addSweet = async (sweetData) => {
  try {
    const sweet = new Sweet(sweetData);
    const savedSweet = await sweet.save();
    return savedSweet;
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw error;
    }
    
    throw new Error(`Failed to add sweet: ${error.message}`);
  }
};

export default addSweet