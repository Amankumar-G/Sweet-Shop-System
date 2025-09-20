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
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-800" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
      </svg>
    ),
    'Candy': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
      </svg>
    ),
    'Pastry': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
      </svg>
    ),
    'Nut-Based': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-900" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
      </svg>
    ),
    'Milk-Based': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-100" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
      </svg>
    ),
    'Vegetable-Based': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
      </svg>
    )
  };

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
