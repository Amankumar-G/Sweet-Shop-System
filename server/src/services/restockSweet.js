import Sweet from "../models/Sweet.js";

const restockSweet = async (sweetId, quantity) => {
  try {
    if (quantity <= 0) {
      throw new Error("Restock quantity must be greater than 0");
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Quantity must be a positive integer");
    }

    const sweet = await Sweet.findById(sweetId);
    if (!sweet) {
      throw new Error("Sweet not found");
    }
    sweet.quantity += quantity;
    const updatedSweet = await sweet.save();

    return {
      sweet: updatedSweet,
      restockedQuantity: quantity,
      newQuantity: updatedSweet.quantity,
    };
  } catch (error) {
    throw new Error(`Failed to restock sweet: ${error.message}`);
  }
};

export default restockSweet;
