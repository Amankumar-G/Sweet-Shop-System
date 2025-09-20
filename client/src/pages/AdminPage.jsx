import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { addSweet as addSweetAPI } from "@/api/sweets";
const AdminPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Valid categories from the API documentation
  const categories = [
    "Chocolate",
    "Candy",
    "Pastry",
    "Nut-Based",
    "Milk-Based",
    "Vegetable-Based"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
    
    if (errors.category) {
      setErrors(prev => ({
        ...prev,
        category: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = "Price must be a valid number ≥ 0";
    }
    
    if (!formData.quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (isNaN(formData.quantity) || parseInt(formData.quantity) < 0) {
      newErrors.quantity = "Quantity must be a valid integer ≥ 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await addSweetAPI({
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      });
      toast.success("Sweet added successfully!");
      setFormData({ name: "", category: "", price: "", quantity: "" });
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        toast.error("Admin access required");
        navigate("/login");
      } else if (error.errors) {
        const serverErrors = {};
        error.errors.forEach(err => { serverErrors[err.path] = err.msg; });
        setErrors(serverErrors);
      } else {
        toast.error(error.message || "Failed to add sweet");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your sweet inventory</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-pink-200 mb-6">
          <Button 
            variant="ghost" 
            className="rounded-none border-b-2 border-orange-500 text-orange-600 font-medium"
          >
            Add New Sweet
          </Button>
          <Button 
            variant="ghost" 
            className="rounded-none text-gray-600"
            onClick={() => navigate("/dashboard")}
          >
            View All Sweets
          </Button>
        </div>

        {/* Add Sweet Form */}
        <Card className="border-pink-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-orange-600">Register New Sweet</CardTitle>
            <CardDescription>Add a new sweet to your inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Sweet Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g., Chocolate Bar, Caramel Toffee"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500 focus:border-red-500" : "border-pink-200 focus:border-orange-400"}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Category Field */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-700">
                  Category *
                </Label>
                <Select 
                  value={formData.category} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger 
                    id="category"
                    className={errors.category ? "border-red-500 focus:border-red-500" : "border-pink-200 focus:border-orange-400"}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>

              {/* Price Field */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-gray-700">
                  Price ($) *
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  className={errors.price ? "border-red-500 focus:border-red-500" : "border-pink-200 focus:border-orange-400"}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
                )}
              </div>

              {/* Quantity Field */}
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-gray-700">
                  Initial Quantity *
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  className={errors.quantity ? "border-red-500 focus:border-red-500" : "border-pink-200 focus:border-orange-400"}
                />
                {errors.quantity && (
                  <p className="text-sm text-red-500">{errors.quantity}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding..." : "Add Sweet"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-orange-400 text-orange-600 hover:bg-orange-50"
                  onClick={() => navigate("/sweets")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Alert */}
        <Alert className="bg-blue-50 border-blue-200 text-blue-800 mt-6">
          <AlertDescription>
            <strong>Note:</strong> Only administrators can add new sweets. All fields marked with * are required.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default AdminPage;