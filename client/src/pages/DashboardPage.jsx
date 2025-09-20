import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { getSweets, Sweet } from "@/api/sweetService";


const DashboardPage = () => {
  const [sweets, setSweets] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    totalStock: 0,
    outOfStock: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const calculateStats = (sweetsData) => {
    const totalProducts = sweetsData.length;
    const lowStockItems = sweetsData.filter(sweet => sweet.quantity > 0 && sweet.quantity < 10).length;
    const outOfStock = sweetsData.filter(sweet => sweet.quantity === 0).length;
    const totalStock = sweetsData.reduce((sum, sweet) => sum + sweet.quantity, 0);

    return {
      totalProducts,
      lowStockItems,
      totalStock,
      outOfStock
    };
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // Fetch sweets data
      const sweetsData = await getSweets();
      
      setSweets(sweetsData);
      setStats(calculateStats(sweetsData));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    fetchDashboardData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(item => (
              <Skeleton key={item} className="h-32 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6">
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header with refresh button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600 mt-2">
              Here's what's happening in your sweet shop today.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={refreshData}
            className="border-orange-400 text-orange-600 hover:bg-orange-50"
          >
            Refresh Data
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4"
                onClick={refreshData}
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-pink-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                Total Products
                <Badge variant="outline" className="ml-2 bg-pink-50 text-pink-700">
                  Inventory
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.totalProducts}</div>
              <p className="text-xs text-gray-500 mt-1">Sweets in your inventory</p>
            </CardContent>
          </Card>

          <Card className="border-pink-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                Low Stock
                <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700">
                  Alert
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{stats.lowStockItems}</div>
              <p className="text-xs text-gray-500 mt-1">Items with less than 10 in stock</p>
            </CardContent>
          </Card>

          <Card className="border-pink-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-600">{stats.totalStock}</div>
              <p className="text-xs text-gray-500 mt-1">Total items available</p>
            </CardContent>
          </Card>

          <Card className="border-pink-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                Out of Stock
                <Badge variant="outline" className="ml-2 bg-red-50 text-red-700">
                  Urgent
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.outOfStock}</div>
              <p className="text-xs text-gray-500 mt-1">Items needing restock</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-pink-200 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-orange-600">Quick Actions</CardTitle>
            <CardDescription>Manage your sweet inventory quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {user.isAdmin && (
                <Button asChild className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600">
                  <Link to="/sweets/add">Add New Sweet</Link>
                </Button>
              )}
              <Button asChild variant="outline" className="border-orange-400 text-orange-600 hover:bg-orange-50">
                <Link to="/sweets">Check All Sweets</Link>
              </Button>
              {user.isAdmin && (
                <Button asChild variant="outline" className="border-pink-400 text-pink-600 hover:bg-pink-50">
                  <Link to="/inventory">Manage Inventory</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        {stats.lowStockItems > 0 && (
          <Alert className="bg-amber-50 border-amber-200 text-amber-800 mb-6">
            <AlertDescription>
              <span className="font-medium">Attention needed:</span> You have {stats.lowStockItems} 
              item{stats.lowStockItems !== 1 ? 's' : ''} with low stock. Consider restocking soon.
            </AlertDescription>
          </Alert>
        )}

        {/* Out of Stock Alert */}
        {stats.outOfStock > 0 && (
          <Alert className="bg-red-50 border-red-200 text-red-800 mb-6">
            <AlertDescription>
              <span className="font-medium">Urgent:</span> You have {stats.outOfStock} 
              item{stats.outOfStock !== 1 ? 's' : ''} out of stock. Restock immediately to avoid lost sales.
            </AlertDescription>
          </Alert>
        )}

        {/* Recent Sweets */}
        <Card className="border-pink-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl text-orange-600">Recent Sweets</CardTitle>
              <CardDescription>Your recently added or updated sweets</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-pink-100 text-pink-800">
              {sweets.length} items
            </Badge>
          </CardHeader>
          <CardContent>
            {sweets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🍬</span>
                </div>
                <p className="font-medium">No sweets found</p>
                <p className="text-sm mt-1">Add some sweets to get started!</p>
                {user.isAdmin && (
                  <Button asChild className="mt-4 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600">
                    <Link to="/sweets/add">Add Your First Sweet</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sweets.slice(0, 6).map(sweet => (
                  <Card key={sweet._id} className="border-pink-100 hover:shadow-md transition-shadow overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-1">{sweet.name}</CardTitle>
                        <Badge 
                          variant={sweet.quantity === 0 ? "destructive" : sweet.quantity < 5 ? "secondary" : "outline"}
                          className={
                            sweet.quantity === 0 ? "bg-red-100 text-red-800 border-red-200" : 
                            sweet.quantity < 5 ? "bg-amber-100 text-amber-800 border-amber-200" : 
                            "bg-green-100 text-green-800 border-green-200"
                          }
                        >
                          {sweet.quantity === 0 ? "Out of Stock" : `${sweet.quantity} in stock`}
                        </Badge>
                      </div>
                      <CardDescription className="flex justify-between">
                        <span className="capitalize">{sweet.category}</span>
                        <span className="font-bold text-pink-600">${sweet.price.toFixed(2)}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <Button asChild size="sm" variant="outline" className="border-orange-400 text-orange-600 hover:bg-orange-50">
                          <Link to={`/sweets/${sweet._id}`}>View Details</Link>
                        </Button>
                        <Button 
                          asChild 
                          size="sm" 
                          disabled={sweet.quantity === 0}
                          className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600"
                        >
                          <Link to={`/sweets/${sweet._id}/purchase`}>Purchase</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;