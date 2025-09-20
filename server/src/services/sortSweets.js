import Sweet from '../models/Sweet.js';

const validSortFields = ["name", "category", "price", "quantity"];

const sortSweets = async (sweets = null, sortBy = "name", sortOrder = "asc") => {
  try {
    
    if (!["asc", "desc"].includes(sortOrder)) {
      throw new Error("Invalid sort direction");
    }
    
    if (!validSortFields.includes(sortBy)) {
      throw new Error("Invalid sort field");
    }
    const direction = sortOrder === "desc" ? -1 : 1;

    let sweetsToSort = sweets;

    if (!Array.isArray(sweets)) {
      const sortOptions = { [sortBy]: direction };
      const dbSweets = await Sweet.find().sort(sortOptions);
      return dbSweets;
    }

    const sorted = [...sweetsToSort].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (aVal < bVal) return -1 * direction;
      if (aVal > bVal) return 1 * direction;
      return 0;
    });

    return sorted;
  } catch (error) {
    throw new Error(`Failed to sort sweets: ${error.message}`);
  }
};

export default sortSweets;
