import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutProvider } from './contexts/LayoutContext';
import HomePage from './pages/HomePage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import DashboardPage from './pages/DashboardPage';
import SweetsPage from './pages/SweetsPage';
import AdminPage from './pages/AdminPage';
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            } />
            <Route path="/sweets" element={
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
        </div>
      </Router>
    </LayoutProvider>
  );
}

export default App;