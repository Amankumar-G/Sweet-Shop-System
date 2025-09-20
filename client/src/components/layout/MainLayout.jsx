import { useLayout } from '@/contexts/LayoutContext';
import Header from './Header';

const MainLayout = ({ children }) => {
  const { user } = useLayout();

  // Redirect to home if not logged in
  if (!user) {
    window.location.href = '/';
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-1 p-6 mt-4">
        <div className="mx-auto w-full max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
