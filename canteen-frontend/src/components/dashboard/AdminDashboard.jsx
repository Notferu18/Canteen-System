import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, ShoppingCart, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://127.0.0.1:8000/api/reports/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        };
        fetchData();
    }, []);

    if (!data) return <div className="p-10 text-white">INITIALIZING ANALYTICS...</div>;

    const COLORS = ['#dc2626', '#7f1d1d', '#450a0a'];

    return (
        <div className="p-8 bg-black min-h-screen text-white">
            <h1 className="text-2xl font-black uppercase tracking-[0.3em] mb-8 border-b border-red-600 pb-2">
                Executive_Summary
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-zinc-900 p-6 border-l-4 border-red-600">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase">Total Revenue</p>
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-black">₱{data.totalRevenue}</h2>
                        <DollarSign className="text-zinc-700" />
                    </div>
                </div>
                <div className="bg-zinc-900 p-6 border-l-4 border-zinc-700">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase">Total Orders</p>
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-black">{data.totalOrders}</h2>
                        <ShoppingCart className="text-zinc-700" />
                    </div>
                </div>
                <div className="bg-zinc-900 p-6 border-l-4 border-amber-600">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase">Low Stock Alerts</p>
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-black text-amber-500">{data.lowStockCount}</h2>
                        <AlertTriangle className="text-amber-900" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-zinc-900 p-6 border border-zinc-800">
                    <h3 className="text-xs font-bold uppercase mb-6 text-zinc-400">Daily Revenue Flow</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.salesData}>
                                <XAxis dataKey="day" stroke="#52525b" fontSize={12} />
                                <YAxis stroke="#52525b" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none' }} />
                                <Bar dataKey="amount" fill="#dc2626" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-zinc-900 p-6 border border-zinc-800">
                    <h3 className="text-xs font-bold uppercase mb-6 text-zinc-400">Category Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data.categoryData} innerRadius={60} outerRadius={80} dataKey="value">
                                    {data.categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;