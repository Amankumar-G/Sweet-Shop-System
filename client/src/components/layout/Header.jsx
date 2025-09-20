import { useLayout } from '@/contexts/LayoutContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useLayout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side: Logo or heading */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-orange-500">Sweet Shop</h1>
        </div>

        {/* Right side: User dropdown or auth buttons */}
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-sm font-medium">
                      {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end" forceMount>
                {/* User Info */}
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Navigation Links */}
                <DropdownMenuItem onClick={() => handleNavigation('/dashboard')}>
                  View Sweets
                </DropdownMenuItem>

                {user.role === 'admin' && (
                  <DropdownMenuItem onClick={() => handleNavigation('/admin')}>
                    Admin Panel
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-3">
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
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
