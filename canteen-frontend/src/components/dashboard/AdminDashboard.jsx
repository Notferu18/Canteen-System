import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DollarSign, ShoppingCart, AlertTriangle, TrendingUp, Download, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SalesChart from './SalesChart';
import CategoryPieChart from './CategoryPieChart';
import OrderTrendChart from './OrderTrendChart';

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(thirtyDaysAgo);
    const [endDate, setEndDate] = useState(today);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://127.0.0.1:8000/api/reports/dashboard', {
                headers: { Authorization: `Bearer ${token}` },
                params: { start: startDate, end: endDate }
            });
            setData(res.data);
        } catch (err) {
            setError('Failed to load dashboard data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        if (!data) return;

        const rows = [
            ['CANTEEN MANAGEMENT SYSTEM - SALES REPORT'],
            [`Date Range: ${startDate} to ${endDate}`],
            [''],
            ['SUMMARY'],
            ['Total Revenue', `₱${data.totalRevenue}`],
            ['Total Orders', data.totalOrders],
            ['Average Order Value', `₱${data.totalOrders ? (data.totalRevenue / data.totalOrders).toFixed(2) : '0.00'}`],
            ['Low Stock Items', data.lowStockCount],
            [''],
            ['DAILY SALES'],
            ['Day', 'Revenue'],
            ...(data.salesData || []).map(d => [d.day, `₱${d.amount}`]),
            [''],
            ['BEST SELLERS'],
            ['Item', 'Qty Sold', 'Revenue'],
            ...(data.bestSellers || []).map(i => [i.name, i.total_qty, `₱${i.revenue}`]),
            [''],
            ['CATEGORY DISTRIBUTION'],
            ['Category', 'Count'],
            ...(data.categoryData || []).map(c => [c.name, c.value]),
        ];

        const csvContent = rows.map(row =>
            row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sales-report-${startDate}-to-${endDate}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Initializing Analytics...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="flex flex-col items-center gap-3">
                <p className="text-red-500 text-sm">{error}</p>
                <button
                    onClick={fetchData}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs uppercase tracking-widest rounded-sm hover:text-white transition"
                >
                    <RefreshCw size={12} /> Retry
                </button>
            </div>
        </div>
    );

    const summaryCards = [
        {
            label: 'Total Revenue',
            value: `₱${Number(data.totalRevenue).toLocaleString()}`,
            icon: <DollarSign size={18} />,
            accent: 'border-red-600',
            iconBg: 'bg-red-600/10 text-red-500',
            change: 'All time',
            danger: false,
            link: null,
        },
        {
            label: 'Total Orders',
            value: data.totalOrders,
            icon: <ShoppingCart size={18} />,
            accent: 'border-zinc-600',
            iconBg: 'bg-zinc-800 text-zinc-400',
            change: 'Click to view orders →',
            danger: false,
            link: '/orders',
        },
        {
            label: 'Avg Order Value',
            value: `₱${data.totalOrders ? (data.totalRevenue / data.totalOrders).toFixed(2) : '0.00'}`,
            icon: <TrendingUp size={18} />,
            accent: 'border-blue-700',
            iconBg: 'bg-blue-900/20 text-blue-400',
            change: 'Per transaction',
            danger: false,
            link: null,
        },
        {
            label: 'Low Stock Alerts',
            value: data.lowStockCount,
            icon: <AlertTriangle size={18} />,
            accent: 'border-amber-600',
            iconBg: 'bg-amber-900/20 text-amber-500',
            change: data.lowStockCount > 0 ? 'Click to view inventory →' : 'All clear',
            danger: data.lowStockCount > 0,
            link: '/inventory',
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="border-b border-zinc-900 px-8 py-4 flex items-center justify-between sticky top-0 bg-black/95 backdrop-blur-sm z-10">
                <div>
                    <h1 className="text-lg font-black uppercase tracking-[0.25em] text-white">
                        Admin <span className="text-red-600">Dashboard</span>
                    </h1>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-0.5">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Live</span>
                </div>
            </div>

            <div className="p-8 space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-950 border border-zinc-900 rounded-sm p-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Date Range</p>
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="bg-black border border-zinc-800 text-white text-xs px-3 py-2 rounded-sm outline-none focus:border-red-600 transition-colors"
                            />
                            <span className="text-zinc-600 text-xs">to</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="bg-black border border-zinc-800 text-white text-xs px-3 py-2 rounded-sm outline-none focus:border-red-600 transition-colors"
                            />
                        </div>
                        <button
                            onClick={fetchData}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest rounded-sm transition"
                        >
                            <RefreshCw size={12} />
                            Apply
                        </button>
                    </div>
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-4 py-2 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-black uppercase tracking-widest rounded-sm transition"
                    >
                        <Download size={12} />
                        Export CSV
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {summaryCards.map((card, i) => (
                        <div
                            key={i}
                            onClick={() => card.link && navigate(card.link)}
                            className={`bg-zinc-950 border border-zinc-900 border-l-2 ${card.accent} rounded-sm p-5 flex flex-col gap-3
                                ${card.link ? 'cursor-pointer hover:bg-zinc-900 transition-colors' : ''}`}
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                    {card.label}
                                </p>
                                <div className={`p-2 rounded-sm ${card.iconBg}`}>
                                    {card.icon}
                                </div>
                            </div>
                            <p className={`text-3xl font-black tracking-tight ${card.danger ? 'text-amber-400' : 'text-white'}`}>
                                {card.value}
                            </p>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${card.danger ? 'text-amber-600' : 'text-zinc-600'}`}>
                                {card.change}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <SalesChart data={data.salesData || []} />
                    </div>
                    <div>
                        <CategoryPieChart data={data.categoryData || []} />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <OrderTrendChart data={data.orderTrends || data.salesData || []} />

                    <div className="bg-zinc-950 border border-zinc-900 rounded-sm p-6">
                        <div className="mb-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-white">Best Sellers</h3>
                            <p className="text-[10px] text-zinc-600 mt-0.5">Top items by revenue</p>
                        </div>
                        <div className="space-y-3">
                            {(data.bestSellers || []).slice(0, 5).map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-zinc-700 w-4">{i + 1}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wide">
                                                {item.name}
                                            </span>
                                            <span className="text-[10px] font-black text-red-500">
                                                ₱{Number(item.revenue).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-red-600 rounded-full"
                                                style={{
                                                    width: `${(item.revenue / (data.bestSellers[0]?.revenue || 1)) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!data.bestSellers || data.bestSellers.length === 0) && (
                                <p className="text-zinc-700 text-xs text-center py-4">No data available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;