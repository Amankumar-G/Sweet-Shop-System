import searchSweets from "../services/searchSweets.js";
import sortSweets from "../services/sortSweets.js";

export const searchAndSortSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice, sortBy, sortOrder } = req.query;

    const parsedMinPrice =
      minPrice !== undefined ? Number(minPrice) : undefined;
    const parsedMaxPrice =
      maxPrice !== undefined ? Number(maxPrice) : undefined;

    if (
      (parsedMinPrice !== undefined && isNaN(parsedMinPrice)) ||
      (parsedMaxPrice !== undefined && isNaN(parsedMaxPrice))
    ) {
      return res
        .status(400)
        .json({ error: "Failed to search sweets: Price must be a number" });
    }

    const searchCriteria = {
      name,
      category,
      minPrice: parsedMinPrice,
      maxPrice: parsedMaxPrice,
    };

    let sweets = await searchSweets(searchCriteria);

    if (sortBy || sortOrder) {
      sweets = await sortSweets(sweets, sortBy, sortOrder); 
    }

    return res.status(200).json(sweets);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
