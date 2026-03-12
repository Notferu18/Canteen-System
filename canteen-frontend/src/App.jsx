import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="flex min-h-screen bg-black text-white">
      {!isLoginPage && <Sidebar />}
      
      <div className={`flex-1 ${!isLoginPage ? 'ml-64' : ''}`}>
        {children}
      </div>
    </div>
  );
};

function App() {
  const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.role?.toUpperCase() === 'ADMIN';
  };

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              {isAdmin() ? <AdminDashboard /> : <Navigate to="/menu" />}
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

          <Route path="/inventory-logs" element={
            <ProtectedRoute>
              {isAdmin() ? <InventoryLogs /> : <Navigate to="/menu" />}
            </ProtectedRoute>
          } />

          <Route path="/orders" element={
            <ProtectedRoute>
              <OrderQueue />
            </ProtectedRoute>
          } />
          
          <Route path="/inventory-master" element={
            <ProtectedRoute>
              {isAdmin() ? <InventoryTable /> : <Navigate to="/menu" />}
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;