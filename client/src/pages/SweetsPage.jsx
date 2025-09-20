import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { sweetsAPI } from '@/api/sweets';
import SweetCard from '@/components/sweets/SweetCard';
import { toast } from "sonner"

const SweetsPage = () => {
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const categories = ['all', 'Chocolate', 'Candy', 'Pastry', 'Nut-Based', 'Milk-Based', 'Vegetable-Based'];
  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'newest', label: 'Newest First' },
  ];

  useEffect(() => {
    fetchSweets();
  }, []);

  useEffect(() => {
    filterAndSortSweets();
  }, [sweets, searchTerm, categoryFilter, sortBy]);

  const fetchSweets = async () => {
    try {
      setIsLoading(true);
      const response = await sweetsAPI.getAll();
      setSweets(response.data || response);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortSweets = () => {
    let filtered = sweets;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(sweet =>
        sweet.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(sweet => sweet.category === categoryFilter);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredSweets(filtered);
  };

  const handleRefresh = () => {
    fetchSweets();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Our Sweets Collection</h1>
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
          <h1 className="text-2xl font-bold text-gray-900">Our Sweets Collection</h1>
          <p className="text-sm text-gray-600 mt-1">
            {filteredSweets.length} {filteredSweets.length === 1 ? 'sweet' : 'sweets'} available
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

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search sweets by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-2">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm">Category</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort" className="text-sm">Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort" className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredSweets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSweets.map(sweet => (
            <SweetCard
              key={sweet._id || sweet.id}
              sweet={sweet}
              onPurchase={fetchSweets}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sweets found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || categoryFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'No sweets are currently available in the shop.'}
          </p>
          {(searchTerm || categoryFilter !== 'all') && (
            <Button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
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