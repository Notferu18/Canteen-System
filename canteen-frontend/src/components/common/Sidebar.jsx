import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, ClipboardList, LogOut, History, UserCircle, Clock, PackagePlus } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'OPERATOR', role: 'ADMIN' };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const allMenuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['ADMIN'] },
        { name: 'Inventory', path: '/inventory', icon: <ClipboardList size={20} />, roles: ['ADMIN', 'CASHIER'] },
        { name: 'Menu View', path: '/menu', icon: <UtensilsCrossed size={20} />, roles: ['ADMIN', 'CASHIER'] },
        { name: 'Order Queue', path: '/orders', icon: <Clock size={20} />, roles: ['ADMIN', 'CASHIER'] },
        { name: 'Audit Trail', path: '/inventory-logs', icon: <History size={20} />, roles: ['ADMIN'] },
        { name: 'Inventory Master', path: '/inventory-master', icon: <PackagePlus size={20} />, roles: ['ADMIN'] },
    ];

    const menuItems = allMenuItems.filter(item => item.roles.includes(user.role?.toUpperCase()));

    return (
        <div className="h-screen w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-red-600">
                <h2 className="text-red-600 font-bold text-xl tracking-tighter uppercase italic">Canteen OS</h2>
                <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">System Active</p>
                </div>
            </div>

            <div className="p-6 bg-zinc-900/30 border-b border-zinc-900">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-800 rounded-sm border border-zinc-700">
                        <UserCircle size={24} className="text-red-600" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{user.role || 'GUEST'}</p>
                        <p className="text-sm font-black text-white truncate uppercase">{user.name}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 mt-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-4 px-6 py-4 transition-all duration-300 ${
                            location.pathname === item.path
                                ? 'bg-red-600/10 text-red-500 border-r-4 border-red-600 shadow-[inset_-10px_0_15px_-10px_rgba(220,38,38,0.3)]'
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                        }`}
                    >
                        {item.icon}
                        <span className="text-xs font-bold uppercase tracking-widest">{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-zinc-900">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-red-500 hover:bg-red-500/5 transition-all w-full group rounded-sm"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black tracking-[0.2em]">TERMINATE SESSION</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;