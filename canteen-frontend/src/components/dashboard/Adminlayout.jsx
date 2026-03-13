import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AdminLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="bg-black min-h-screen">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <Navbar sidebarCollapsed={collapsed} />
            <main
                className="transition-all duration-300 pt-14"
                style={{ marginLeft: collapsed ? '4rem' : '16rem' }}
            >
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;