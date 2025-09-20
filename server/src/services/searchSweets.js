import Sweet from "../models/Sweet.js";
import mongoose from "mongoose";

const VALID_CATEGORIES = ['Chocolate', 'Candy', 'Pastry', 'Nut-Based', 'Milk-Based', 'Vegetable-Based'];

const searchSweets = async (searchCriteria) => {
  try {
    const { name, category, minPrice, maxPrice } = searchCriteria;
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      if (!VALID_CATEGORIES.includes(category)) {
        throw new Error("Invalid category");
      }
      query.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      if (minPrice < 0 || maxPrice < 0) {
        throw new Error("Price must be non-negative");
      }
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    const sweets = await Sweet.find(query);
    return sweets;
  } catch (error) {
    throw new Error(`Failed to search sweets: ${error.message}`);
  }
};
export default searchSweets;