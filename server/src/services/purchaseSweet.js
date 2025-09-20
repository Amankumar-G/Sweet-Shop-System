import Sweet from "../models/Sweet.js";

const purchaseSweet = async (sweetId, quantity) => {
  try {
    if (quantity <= 0) {
      throw new Error("Purchase quantity must be greater than 0");
    }

    const sweet = await Sweet.findById(sweetId);
    if (!sweet) {
      throw new Error("Sweet not found");
    }

    if (sweet.quantity < quantity) {
      throw new Error("Insufficient stock available");
    }

    sweet.quantity -= quantity;
    const updatedSweet = await sweet.save();

    return {
      sweet: updatedSweet,
      purchasedQuantity: quantity,
      remainingQuantity: updatedSweet.quantity,
    };
  } catch (error) {
    throw new Error(`Failed to purchase sweet: ${error.message}`);
  }
};

export default purchaseSweet;