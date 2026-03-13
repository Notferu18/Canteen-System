import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Sidebar from './components/common/Sidebar';

import MenuList from './components/menu/MenuList';
import POSInterface from './components/orders/POSInterface';
import InventoryLogs from './components/inventory/InventoryLogs';
import InventoryTable from './components/inventory/InventoryTable';
import AdminDashboard from './components/dashboard/AdminDashboard';
import OrderQueue from './components/orders/OrderQueue';
import Register from './components/auth/Register';
import UserManagement from './components/auth/UserManagement';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const { user, loading } = useAuth();

  const isLoginPage = location.pathname === '/login';

  if (loading) {
    return (
      <div className="flex min-h-screen bg-black text-white items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-600 text-xs uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {!isLoginPage && user && <Sidebar />}
      <div className={`flex-1 min-w-0 ${!isLoginPage && user ? 'ml-64' : ''}`}>
        {children}
      </div>
    </div>
  );
};

function AppRoutes() {
  const { user } = useAuth();

  const isAdmin = () => user?.role?.toLowerCase() === 'admin';

  return (
    <AppLayout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/users" element={
          <ProtectedRoute>
          {isAdmin() ? <UserManagement /> : <Navigate to="/pos" />}
          </ProtectedRoute>
          } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            {isAdmin() ? <AdminDashboard /> : <Navigate to="/pos" />}
          </ProtectedRoute>
        } />

        <Route path="/inventory-logs" element={
          <ProtectedRoute>
            {isAdmin() ? <InventoryLogs /> : <Navigate to="/pos" />}
          </ProtectedRoute>
        } />

        <Route path="/menu" element={
          <ProtectedRoute>
            <MenuList />
          </ProtectedRoute>
        } />

        <Route path="/pos" element={
          <ProtectedRoute>
            <POSInterface />
          </ProtectedRoute>
        } />

        <Route path="/inventory" element={
          <ProtectedRoute>
            <InventoryTable />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <OrderQueue />
          </ProtectedRoute>
        } />

        <Route path="/" element={
          <Navigate to={isAdmin() ? "/dashboard" : "/pos"} replace />
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AppLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;