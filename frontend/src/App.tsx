import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {!isAuthenticated && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register') ? (
          <Navigate to="/login" replace />
        ) : (
          <Routes>
            <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
            <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;