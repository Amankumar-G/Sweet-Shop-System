import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const HomePage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-orange-600">Sweet Delights</h1>
        </div>
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            className="border-orange-400 text-orange-600 hover:bg-orange-50"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button 
            className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className={`max-w-4xl mx-auto text-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Welcome to <span className="text-orange-500">Sweet Delights</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Discover the most delicious traditional sweets made with love and the finest ingredients. 
            Our sweet shop brings joy to every celebration.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white px-8 py-3 text-lg"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-orange-400 text-orange-600 hover:bg-orange-50 px-8 py-3 text-lg"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-pink-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-orange-500">Variety</CardTitle>
                <CardDescription>Wide selection of traditional sweets</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">From gulab jamun to jalebi, we have all your favorites</p>
              </CardContent>
            </Card>
            
            <Card className="border-pink-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-orange-500">Quality</CardTitle>
                <CardDescription>Made with finest ingredients</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">We use only the best ingredients for authentic taste</p>
              </CardContent>
            </Card>
            
            <Card className="border-pink-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-orange-500">Service</CardTitle>
                <CardDescription>Fast delivery & easy ordering</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Enjoy hassle-free ordering and quick delivery</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-pink-200 py-6 text-center text-gray-600">
        <p>© {new Date().getFullYear()} Sweet Delights. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
