import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';

const Dashboard = () => <div className="p-10 text-white">Admin Dashboard Coming Soon...</div>;
const MenuPage = () => <div className="p-10 text-white">Menu Page Coming Soon...</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-black"> 
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/menu" element={
              <ProtectedRoute>
                <MenuPage />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;