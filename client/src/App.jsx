import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutProvider } from './contexts/LayoutContext';
import HomePage from './pages/HomePage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import SweetsPage from './pages/SweetsPage';
import AdminPage from './pages/AdminPage';
import MainLayout from './components/layout/MainLayout';
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <LayoutProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            
            <Route path="/dashboard" element={
              <MainLayout>
                <SweetsPage />
              </MainLayout>
            } />
            <Route path="/admin" element={
              <MainLayout>
                <AdminPage />
              </MainLayout>
            } />
          </Routes>
           <Toaster />
        </div>
      </Router>
    </LayoutProvider>
  );
}

export default App;