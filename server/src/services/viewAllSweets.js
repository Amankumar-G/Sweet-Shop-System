import Sweet from '../models/Sweet.js';

const viewAllSweets = async () => {
  try {
    const sweets = await Sweet.find();
    return sweets;
  } catch (error) {
    throw new Error(`Failed to retrieve sweets: ${error.message}`);
  }
};

export default viewAllSweets