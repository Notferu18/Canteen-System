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

const AppLayout = ({ children }) => {
  const location = useLocation();
  const { user, loading } = useAuth();
  
  const isLoginPage = location.pathname === '/login';

  if (loading) {
    return (
      <div className="flex min-h-screen bg-black text-white items-center justify-center">
        <div className="text-xl font-mono tracking-widest">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {!isLoginPage && user && <Sidebar />}
      
      <div className={`flex-1 ${!isLoginPage && user ? 'ml-64' : ''}`}>
        {children}
      </div>
    </div>
  );
};

function AppRoutes() {
  const { user } = useAuth();

const isAdmin = () => {
    return user?.role?.toLowerCase() === 'admin';
  };

  return (
    <AppLayout>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            {isAdmin() ? <AdminDashboard /> : <Navigate to="/menu" />}
          </ProtectedRoute>
        } />

        <Route path="/inventory-logs" element={
          <ProtectedRoute>
            {isAdmin() ? <InventoryLogs /> : <Navigate to="/menu" />}
          </ProtectedRoute>
        } />

        <Route path="/inventory-master" element={
          <ProtectedRoute>
            {isAdmin() ? <InventoryTable /> : <Navigate to="/menu" />}
          </ProtectedRoute>
        } />

        <Route path="/menu" element={
          <ProtectedRoute>
            <POSInterface /> 
          </ProtectedRoute>
        } />

        <Route path="/inventory" element={
          <ProtectedRoute>
            <MenuList />
          </ProtectedRoute>
        } />

        <Route path="/orders" element={
          <ProtectedRoute>
            <OrderQueue />
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
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