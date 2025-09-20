import Sweet from "../models/Sweet.js";

const updateSweet = async (sweetId, updateData) => {
  try {
    const updatedSweet = await Sweet.findByIdAndUpdate(
      sweetId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedSweet) {
      throw new Error("Sweet not found");
    }

    return updatedSweet;

  } catch (error) {
    if (error.name === "ValidationError") {
      throw error;
    }
    throw new Error(`Failed to update sweet: ${error.message}`);
  }
};

export default updateSweet;