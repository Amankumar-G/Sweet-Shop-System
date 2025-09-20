import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { registerUser } from "@/api/auth"; // import API function

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (formData.username.length < 3) newErrors.username = "Username must be at least 3 characters";
    else if (formData.username.length > 30) newErrors.username = "Username cannot exceed 30 characters";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email address";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const data = await registerUser(formData); // call the API
      setAlert({ show: true, message: "Registration successful! Redirecting to login...", type: "success" });
      if (data.token) localStorage.setItem("token", data.token);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setAlert({ show: true, message: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-pink-200 shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-orange-600">Create an Account</CardTitle>
          <CardDescription className="text-center">Enter your details to join our sweet community</CardDescription>
        </CardHeader>
        <CardContent>
          {alert.show && <Alert variant={alert.type === "error" ? "destructive" : "default"} className="mb-4"><AlertDescription>{alert.message}</AlertDescription></Alert>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" type="text" placeholder="Enter your username" value={formData.username} onChange={handleChange} className={errors.username ? "border-red-500" : ""}/>
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} className={errors.email ? "border-red-500" : ""}/>
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Create a password" value={formData.password} onChange={handleChange} className={errors.password ? "border-red-500" : ""}/>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} className={errors.confirmPassword ? "border-red-500" : ""}/>
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600" disabled={isLoading}>{isLoading ? "Creating account..." : "Create Account"}</Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Already have an account? <Link to="/login" className="text-orange-500 hover:underline">Sign in</Link></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
