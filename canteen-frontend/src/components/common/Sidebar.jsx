import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, UtensilsCrossed, ClipboardList,
    LogOut, History, UserCircle, Clock, ShoppingCart,
    ChevronLeft, ChevronRight
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const user = JSON.parse(localStorage.getItem('user')) || { name: 'OPERATOR', role: 'ADMIN' };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const allMenuItems = [
        { name: 'Dashboard',        path: '/dashboard',        icon: <LayoutDashboard size={18} />, roles: ['ADMIN'] },
        { name: 'POS Terminal',     path: '/pos',              icon: <ShoppingCart size={18} />,    roles: ['ADMIN', 'CASHIER'] },
        { name: 'Menu View',        path: '/menu',             icon: <UtensilsCrossed size={18} />, roles: ['ADMIN', 'CASHIER'] },
        { name: 'Order Queue',      path: '/orders',           icon: <Clock size={18} />,           roles: ['ADMIN', 'CASHIER'] },
        { name: 'Inventory',        path: '/inventory',        icon: <ClipboardList size={18} />,   roles: ['ADMIN', 'CASHIER'] },
        { name: 'Audit Trail',      path: '/inventory-logs',   icon: <History size={18} />,         roles: ['ADMIN'] },
        { name: 'User Management',  path: '/users',            icon: <Users size={18} />,           roles: ['ADMIN'] },
    ];

    const menuItems = allMenuItems.filter(item =>
        item.roles.includes(user.role?.toUpperCase())
    );

    const roleColor = {
        ADMIN: 'text-red-500 bg-red-600/10',
        CASHIER: 'text-blue-400 bg-blue-900/20',
        CUSTOMER: 'text-green-400 bg-green-900/20',
    };

    return (
        <div className={`h-screen ${collapsed ? 'w-16' : 'w-64'} bg-zinc-950 border-r border-zinc-900 flex flex-col fixed left-0 top-0 transition-all duration-300 z-50`}>

            <div className={`flex items-center ${collapsed ? 'justify-center px-0' : 'justify-between px-5'} py-5 border-b border-zinc-900`}>
                {!collapsed && (
                    <div>
                        <h2 className="text-red-600 font-black text-base tracking-tighter uppercase italic leading-none">
                            Canteen<span className="text-white">OS</span>
                        </h2>
                        <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-[9px] text-zinc-600 uppercase tracking-[0.2em]">System Active</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-sm text-zinc-600 hover:text-white hover:bg-zinc-900 transition-all"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {!collapsed && (
                <div className="px-4 py-4 border-b border-zinc-900 bg-zinc-900/20">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 rounded-sm flex items-center justify-center flex-shrink-0">
                            <UserCircle size={18} className="text-red-600" />
                        </div>
                        <div className="overflow-hidden min-w-0">
                            <p className="text-white text-sm font-black uppercase truncate leading-tight">{user.name}</p>
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm ${roleColor[user.role?.toUpperCase()] || 'text-zinc-500 bg-zinc-800'}`}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {collapsed && (
                <div className="flex justify-center py-3 border-b border-zinc-900">
                    <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 rounded-sm flex items-center justify-center">
                        <UserCircle size={18} className="text-red-600" />
                    </div>
                </div>
            )}

            <nav className="flex-1 py-3 overflow-y-auto">
                {!collapsed && (
                    <p className="text-[9px] text-zinc-700 uppercase tracking-[0.25em] font-bold px-5 mb-2">Navigation</p>
                )}
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            title={collapsed ? item.name : ''}
                            className={`flex items-center gap-3 ${collapsed ? 'justify-center px-0 mx-2' : 'px-5'} py-3 my-0.5 rounded-sm transition-all duration-200 group
                                ${isActive
                                    ? 'bg-red-600/10 text-red-500 border-r-2 border-red-600'
                                    : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                                }`}
                        >
                            <span className={`flex-shrink-0 ${isActive ? 'text-red-500' : 'text-zinc-600 group-hover:text-zinc-300'}`}>
                                {item.icon}
                            </span>
                            {!collapsed && (
                                <span className="text-[11px] font-bold uppercase tracking-widest">{item.name}</span>
                            )}
                            {isActive && !collapsed && (
                                <span className="ml-auto w-1 h-1 bg-red-500 rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-zinc-900 p-3">
                <button
                    onClick={handleLogout}
                    title={collapsed ? 'Logout' : ''}
                    className={`flex items-center ${collapsed ? 'justify-center w-full py-2.5' : 'gap-3 px-3 py-2.5 w-full'} text-zinc-600 hover:text-red-500 hover:bg-red-500/5 transition-all rounded-sm group`}
                >
                    <LogOut size={16} className="flex-shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                    {!collapsed && (
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Terminate Session</span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;