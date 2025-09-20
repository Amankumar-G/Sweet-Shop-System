import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { sweetsAPI } from "@/api/sweets";
import SweetCard from "@/components/sweets/SweetCard";
import { toast } from "sonner";

const SweetsPage = () => {
  const [sweets, setSweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [role, setRole] = useState(localStorage.getItem("role") || "user"); // Example: store role in localStorage

  const categories = [
    "all",
    "Chocolate",
    "Candy",
    "Pastry",
    "Nut-Based",
    "Milk-Based",
    "Vegetable-Based",
  ];
  const sortOptions = [
    { value: "name", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "price", label: "Price (Low to High)" },
    { value: "price-desc", label: "Price (High to Low)" },
    { value: "newest", label: "Newest First" },
  ];

  // Fetch sweets via search API
  const fetchSweets = async () => {
    try {
      setIsLoading(true);

      // Build search params
      const params = {};
      if (searchTerm) params.name = searchTerm;
      if (categoryFilter !== "all") params.category = categoryFilter;

      if (sortBy) {
        if (sortBy.includes("-desc")) {
          params.sortBy = sortBy.split("-")[0];
          params.sortOrder = "desc";
        } else if (sortBy === "newest") {
          params.sortBy = "createdAt";
          params.sortOrder = "desc";
        } else {
          params.sortBy = sortBy;
          params.sortOrder = "asc";
        }
      }

      const data = await sweetsAPI.search(params);
      setSweets(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, [categoryFilter, sortBy]);

  const handleRefresh = () => {
    fetchSweets();
    toast.info("Refreshing sweets list");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Our Sweets Collection
          </h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Our Sweets Collection
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {sweets.length} {sweets.length === 1 ? "sweet" : "sweets"} available
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          className="border-orange-300 text-orange-600 hover:bg-orange-50"
        >
          Refresh
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Search sweets by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={fetchSweets}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            Search
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-2">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm">
              Category
            </Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort" className="text-sm">
              Sort By
            </Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort" className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Sweets Grid */}
      {sweets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sweets.map((sweet) => (
            <SweetCard
              key={sweet._id || sweet.id}
              sweet={sweet}
              onPurchase={fetchSweets}
              role={role}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No sweets found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || categoryFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "No sweets are currently available in the shop."}
          </p>
          {(searchTerm || categoryFilter !== "all") && (
            <Button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
              }}
              className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SweetsPage;
