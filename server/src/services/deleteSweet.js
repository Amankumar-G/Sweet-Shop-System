import Sweet from "../models/Sweet.js";

const deleteSweet = async (sweetId) => {
  try {
    const deletedSweet = await Sweet.findByIdAndDelete(sweetId);
    if (!deletedSweet) {
      throw new Error('Sweet not found');
    }
    return deletedSweet;
  } catch (error) {
    throw new Error(`Failed to delete sweet: ${error.message}`);
  }
};

export default deleteSweet