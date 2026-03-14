import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Sidebar from './components/common/Sidebar';
import { Menu } from 'lucide-react';

import MenuList from './components/menu/MenuList';
import POSInterface from './components/orders/POSInterface';
import InventoryLogs from './components/inventory/InventoryLogs';
import InventoryTable from './components/inventory/InventoryTable';
import AdminDashboard from './components/dashboard/AdminDashboard';
import OrderQueue from './components/orders/OrderQueue';
import UserManagement from './components/auth/UserManagement';

import CustomerMenu from './components/customer/CustomerMenu';
import CustomerOrder from './components/customer/CustomerOrder';
import CustomerHistory from './components/customer/CustomerHistory';

const AppLayout = ({ children }) => {
    const location = useLocation();
    const { user, loading } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const isLoginPage = location.pathname === '/login';
    const isRegisterPage = location.pathname === '/register';
    const isAuthPage = isLoginPage || isRegisterPage;

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

    const sidebarWidth = collapsed ? 'md:ml-16' : 'md:ml-64';

    return (
        <div className="flex min-h-screen bg-black text-white">
            {!isAuthPage && user && (
                <Sidebar
                    mobileOpen={mobileOpen}
                    onMobileClose={() => setMobileOpen(false)}
                    collapsed={collapsed}
                    onCollapsedChange={setCollapsed}
                />
            )}

            <div className={`flex-1 min-w-0 h-screen overflow-y-auto transition-all duration-300 ${!isAuthPage && user ? sidebarWidth : ''}`}>
                {!isAuthPage && user && (
                    <div className="md:hidden flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-900 sticky top-0 z-40">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-sm transition"
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="text-red-600 font-black text-sm tracking-tighter uppercase italic">
                            B Y T E S
                        </h2>
                        <div className="w-8" />
                    </div>
                )}
                {children}
            </div>
        </div>
    );
};

function AppRoutes() {
    const { user } = useAuth();

    const isAdmin    = () => user?.role?.toLowerCase() === 'admin';
    const isCashier  = () => user?.role?.toLowerCase() === 'cashier';
    const isCustomer = () => user?.role?.toLowerCase() === 'customer';

    const defaultRoute = () => {
        if (isAdmin())    return '/dashboard';
        if (isCashier())  return '/pos';
        if (isCustomer()) return '/customer/menu';
        return '/login';
    };

    return (
        <AppLayout>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        {isAdmin() ? <AdminDashboard /> : <Navigate to={defaultRoute()} />}
                    </ProtectedRoute>
                } />
                <Route path="/inventory-logs" element={
                    <ProtectedRoute>
                        {isAdmin() ? <InventoryLogs /> : <Navigate to={defaultRoute()} />}
                    </ProtectedRoute>
                } />
                <Route path="/users" element={
                    <ProtectedRoute>
                        {isAdmin() ? <UserManagement /> : <Navigate to={defaultRoute()} />}
                    </ProtectedRoute>
                } />
                <Route path="/menu" element={
                    <ProtectedRoute>
                        {!isCustomer() ? <MenuList /> : <Navigate to="/customer/menu" />}
                    </ProtectedRoute>
                } />
                <Route path="/pos" element={
                    <ProtectedRoute>
                        {!isCustomer() ? <POSInterface /> : <Navigate to="/customer/menu" />}
                    </ProtectedRoute>
                } />
                <Route path="/inventory" element={
                    <ProtectedRoute>
                        {!isCustomer() ? <InventoryTable /> : <Navigate to="/customer/menu" />}
                    </ProtectedRoute>
                } />
                <Route path="/orders" element={
                    <ProtectedRoute>
                        {!isCustomer() ? <OrderQueue /> : <Navigate to="/customer/history" />}
                    </ProtectedRoute>
                } />
                <Route path="/customer/menu" element={
                    <ProtectedRoute>
                        <CustomerMenu />
                    </ProtectedRoute>
                } />
                <Route path="/customer/order" element={
                    <ProtectedRoute>
                        <CustomerOrder />
                    </ProtectedRoute>
                } />
                <Route path="/customer/history" element={
                    <ProtectedRoute>
                        <CustomerHistory />
                    </ProtectedRoute>
                } />

                <Route path="/" element={<Navigate to={defaultRoute()} replace />} />
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