import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const routeTitles = {
    '/dashboard':        { title: 'Dashboard',        sub: 'Analytics & Overview' },
    '/menu':             { title: 'Menu',              sub: 'Browse & Manage Items' },
    '/orders':           { title: 'Order Queue',       sub: 'Live Order Management' },
    '/inventory':        { title: 'Inventory',         sub: 'Stock Monitoring' },
    '/inventory-master': { title: 'Inventory Master',  sub: 'Stock Control' },
    '/inventory-logs':   { title: 'Audit Trail',       sub: 'Change History' },
    '/pos':              { title: 'POS Terminal',       sub: 'Point of Sale' },
};

const Navbar = ({ sidebarCollapsed = false }) => {
    const location = useLocation();
    const { user } = useAuth();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const current = routeTitles[location.pathname] || { title: 'Canteen INV', sub: '' };

    return (
        <header
            className={`fixed top-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-b border-zinc-900 flex items-center justify-between px-6 h-14 transition-all duration-300`}
            style={{ left: sidebarCollapsed ? '4rem' : '16rem' }}
        >
            <div className="flex items-center gap-3">
                <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-white leading-none">
                        {current.title}
                    </h2>
                    {current.sub && (
                        <p className="text-[9px] text-zinc-600 uppercase tracking-widest mt-0.5">{current.sub}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                {searchOpen ? (
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-sm px-3 py-1.5">
                        <Search size={14} className="text-zinc-500" />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="bg-transparent text-white text-xs outline-none w-40 placeholder-zinc-700"
                        />
                        <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                            <X size={14} className="text-zinc-600 hover:text-white transition-colors" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="p-2 text-zinc-600 hover:text-white hover:bg-zinc-900 rounded-sm transition-all"
                    >
                        <Search size={16} />
                    </button>
                )}

                <button className="relative p-2 text-zinc-600 hover:text-white hover:bg-zinc-900 rounded-sm transition-all">
                    <Bell size={16} />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-600 rounded-full" />
                </button>

                <div className="w-px h-5 bg-zinc-800 mx-1" />

                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-zinc-900 rounded-sm">
                    <div className="w-5 h-5 bg-red-600/20 rounded-sm flex items-center justify-center">
                        <span className="text-[9px] font-black text-red-500 uppercase">
                            {user?.name?.charAt(0) || 'U'}
                        </span>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-[10px] font-black text-white uppercase leading-none">{user?.name}</p>
                        <p className="text-[8px] text-zinc-600 uppercase tracking-wider">{user?.role}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;