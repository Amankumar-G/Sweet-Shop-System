import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sweetsAPI } from '@/api/sweets';
import { toast } from "sonner";

const SweetCard = ({ sweet, onPurchase, onRestock, role, isLoading = {} }) => {
  const [restockQuantity, setRestockQuantity] = useState(1);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);

  const categoryIcons = {
     'Chocolate': (
    <div className="relative group cursor-pointer">
      <div className="w-16 h-16 bg-gradient-to-br from-amber-800 to-amber-900 rounded-xl shadow-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-hover:shadow-xl">
        <svg className="w-8 h-8 text-amber-100 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      </div>
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-amber-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
          Chocolate
        </div>
      </div>
    </div>
  ),
  
  'Candy': (
    <div className="relative group cursor-pointer">
      <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl shadow-lg flex items-center justify-center transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 group-hover:shadow-xl">
        <svg className="w-8 h-8 text-white group-hover:animate-bounce" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.75 12.25c0 .41-.34.75-.75.75s-.75-.34-.75-.75.34-.75.75-.75.75.34.75.75zM16 8.5c0-.83-.67-1.5-1.5-1.5S13 7.67 13 8.5s.67 1.5 1.5 1.5S16 9.33 16 8.5zM8.5 13c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      </div>
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-pink-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
          Candy
        </div>
      </div>
    </div>
  ),
  
  'Pastry': (
    <div className="relative group cursor-pointer">
      <div className="w-16 h-16 bg-gradient-to-br from-orange-300 to-amber-500 rounded-xl shadow-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-2 transition-all duration-300 group-hover:shadow-xl">
        <svg className="w-8 h-8 text-amber-900 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C9.38 2 7.25 4.13 7.25 6.75c0 1.82 1.06 3.47 2.68 4.26.06.03.12.05.18.07.1.05.2.09.31.12.05.02.1.03.15.04.15.05.31.08.47.08h1.92c.16 0 .32-.03.47-.08.05-.01.1-.02.15-.04.11-.03.21-.07.31-.12.06-.02.12-.04.18-.07 1.62-.79 2.68-2.44 2.68-4.26C16.75 4.13 14.62 2 12 2zM9 6.75C9 5.23 10.23 4 11.75 4s2.75 1.23 2.75 2.75-1.23 2.75-2.75 2.75S9 8.27 9 6.75z"/>
          <path d="M12 12c-1.06 0-2.05-.28-2.91-.76-.08-.04-.15-.09-.22-.14-.01 0-.02-.01-.03-.01-.07-.05-.14-.11-.2-.17-.04-.03-.07-.07-.11-.11-.04-.04-.07-.08-.11-.12-.03-.04-.06-.08-.09-.12-.03-.04-.06-.09-.09-.13-.02-.04-.05-.08-.07-.12-.02-.04-.04-.09-.06-.13-.02-.04-.03-.08-.05-.12-.01-.04-.03-.09-.04-.13-.01-.04-.02-.08-.03-.12-.01-.05-.02-.09-.02-.14 0-.04-.01-.09-.01-.13v-.01c0-.05 0-.1.01-.14 0-.04.01-.09.02-.13.01-.04.02-.08.03-.12.01-.04.03-.09.04-.13.02-.04.03-.08.05-.12.02-.04.04-.09.06-.13.02-.04.05-.08.07-.12.03-.04.06-.09.09-.13.03-.04.06-.08.09-.12.04-.04.07-.08.11-.12.04-.04.07-.08.11-.11.06-.06.13-.12.2-.17.01 0 .02-.01.03-.01.07-.05.14-.1.22-.14C9.95 11.72 10.94 12 12 12z"/>
          <ellipse cx="12" cy="18" rx="8" ry="3" fill="currentColor" opacity="0.6"/>
        </svg>
      </div>
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-amber-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
          Pastry
        </div>
      </div>
    </div>
  ),
  
  'Nut-Based': (
    <div className="relative group cursor-pointer">
      <div className="w-16 h-16 bg-gradient-to-br from-amber-700 to-amber-900 rounded-xl shadow-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 group-hover:shadow-xl">
        <svg className="w-8 h-8 text-amber-200 group-hover:animate-spin" fill="currentColor" viewBox="0 0 24 24" style={{animationDuration: '2s'}}>
          <path d="M12 4c-1.5 0-3 .5-4 1.5C6.5 7 6 8.5 6 10s.5 3 1.5 4c1 1 2.5 1.5 4 1.5h.5c1.5 0 3-.5 4-1.5 1.5-1 2-2.5 2-4s-.5-3-1.5-4c-1-1-2.5-1.5-4-1.5H12z"/>
          <ellipse cx="12" cy="10" rx="4" ry="2.5" fill="none" stroke="currentColor" strokeWidth="1"/>
          <path d="M10 8.5c.3-.3.7-.5 1-.5s.7.2 1 .5M10 11.5c.3.3.7.5 1 .5s.7-.2 1-.5"/>
        </svg>
      </div>
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-amber-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
          Nuts
        </div>
      </div>
    </div>
  ),
  
  'Milk-Based': (
    <div className="relative group cursor-pointer">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-lg flex items-center justify-center transform group-hover:scale-110 group-hover:-rotate-2 transition-all duration-300 group-hover:shadow-xl border-2 border-blue-300">
        <svg className="w-8 h-8 text-blue-600 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 4v16h14V4H5zm12 14H7V6h10v12z"/>
          <path d="M8 8h8v2H8zM8 11h8v2H8zM8 14h6v2H8z" opacity="0.6"/>
          <path d="M12 18c-1.66 0-3-1.34-3-3h6c0 1.66-1.34 3-3 3z"/>
        </svg>
      </div>
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
          Dairy
        </div>
      </div>
    </div>
  ),
  
  'Vegetable-Based': (
    <div className="relative group cursor-pointer">
      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-hover:shadow-xl">
        <svg className="w-8 h-8 text-green-100 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.28-.22C8.47 20.12 12 16.93 17 15V8z"/>
          <path d="M18.5 2c-1.38 0-2.5 1.12-2.5 2.5 0 .74.33 1.39.83 1.85C16.17 6.89 16 7.42 16 8c0 2.76 2.24 5 5 5V8c0-.58-.17-1.11-.83-1.65.5-.46.83-1.11.83-1.85C20 3.12 18.88 2 17.5 2z" opacity="0.7"/>
          <circle cx="9" cy="13" r="1.5"/>
          <circle cx="12" cy="11" r="1"/>
        </svg>
      </div>
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-green-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
          Veggie
        </div>
      </div>
    </div>)
  }

  const handlePurchase = () => {
    if (purchaseQuantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    if (purchaseQuantity > sweet.quantity) {
      toast.error(`Only ${sweet.quantity} items available`);
      return;
    }

    onPurchase(sweet._id || sweet.id, purchaseQuantity);
  };

  const handleRestock = () => {
    onRestock(sweet._id || sweet.id, parseInt(restockQuantity));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-gradient-to-r from-orange-100 to-pink-100">
            {categoryIcons[sweet.category] || categoryIcons['Candy']}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{sweet.name}</h3>

        <div className="flex items-center justify-center mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            {sweet.category}
          </span>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-orange-600">${sweet.price}</span>
            <span
              className={`text-sm font-medium ${
                sweet.quantity > 10
                  ? 'text-green-600'
                  : sweet.quantity > 0
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}
            >
              {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Purchase Section (User) */}
          {role === "customer" && sweet.quantity > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Input
                  type="number"
                  min="1"
                  max={sweet.quantity}
                  value={purchaseQuantity}
                  onChange={(e) =>
                    setPurchaseQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-20"
                  disabled={isLoading.purchase}
                />
                <Button
                  onClick={handlePurchase}
                  disabled={isLoading.purchase}
                  className="bg-orange-500 hover:bg-orange-600 text-white flex-1"
                >
                  {isLoading.purchase ? "Processing..." : "Purchase"}
                </Button>
              </div>
            </div>
          )}

          {/* Restock Section (Admin only) */}
          {role === "admin" && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Input
                  type="number"
                  min="1"
                  value={restockQuantity}
                  onChange={(e) =>
                    setRestockQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-20"
                  disabled={isLoading.restock}
                />
                <Button
                  onClick={handleRestock}
                  disabled={isLoading.restock}
                  className="bg-green-600 hover:bg-green-700 text-white flex-1"
                >
                  {isLoading.restock ? "Restocking..." : "Restock"}
                </Button>
              </div>
            </div>
          )}

          {sweet.quantity === 0 && role === "customer" && (
            <div className="text-center py-2">
              <span className="text-red-500 text-sm">Out of stock</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SweetCard;
