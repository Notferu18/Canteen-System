import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, Play, Package, RefreshCw, XCircle } from 'lucide-react';

const STATUS_FLOW = {
    'Pending':   { next: 'Preparing', label: 'Start Preparing', icon: <Play size={14} />,        color: 'bg-zinc-800 hover:bg-red-600' },
    'Preparing': { next: 'Ready',     label: 'Mark as Ready',   icon: <Package size={14} />,      color: 'bg-blue-900 hover:bg-blue-700' },
    'Ready':     { next: 'Completed', label: 'Complete Order',  icon: <CheckCircle size={14} />,  color: 'bg-green-800 hover:bg-green-600' },
};

const STATUS_BADGE = {
    'Pending':   'bg-amber-600/20 text-amber-400 border-amber-700/30',
    'Preparing': 'bg-blue-600/20 text-blue-400 border-blue-700/30',
    'Ready':     'bg-green-600/20 text-green-400 border-green-700/30',
    'Completed': 'bg-zinc-800 text-zinc-500 border-zinc-700',
    'Cancelled': 'bg-red-900/20 text-red-400 border-red-800/30',
};

const OrderQueue = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [error, setError] = useState(null);
    const [showCompleted, setShowCompleted] = useState(false);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://127.0.0.1:8000/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
            setError(null);
        } catch (err) {
            setError('Failed to load orders.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        setUpdating(orderId);
        const token = localStorage.getItem('token');
        try {
            await axios.patch(`http://127.0.0.1:8000/api/orders/${orderId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchOrders();
        } catch (err) {
            console.error("Failed to update status", err);
            alert(err.response?.data?.message || 'Failed to update order status.');
        } finally {
            setUpdating(null);
        }
    };

    const activeOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled');
    const completedOrders = orders.filter(o => o.status === 'Completed' || o.status === 'Cancelled');
    const displayOrders = showCompleted ? completedOrders : activeOrders;

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-600 text-xs uppercase tracking-widest">Loading orders...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-widest text-white flex items-center gap-3">
                        <Clock size={24} className="text-red-600" />
                        Order <span className="text-red-600">Queue</span>
                    </h1>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-0.5">
                        Auto-refreshes every 10 seconds
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowCompleted(!showCompleted)}
                        className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-sm border transition ${
                            showCompleted
                                ? 'bg-zinc-800 border-zinc-700 text-white'
                                : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
                        }`}
                    >
                        {showCompleted ? 'Active Orders' : `Completed (${completedOrders.length})`}
                    </button>
                    <button
                        onClick={fetchOrders}
                        className="p-2 text-zinc-600 hover:text-white hover:bg-zinc-900 rounded-sm transition"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            <div className="flex gap-3 mb-6">
                {Object.entries(STATUS_BADGE).slice(0, 3).map(([status, style]) => {
                    const count = orders.filter(o => o.status === status).length;
                    return (
                        <div key={status} className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-[10px] font-bold uppercase tracking-widest ${style}`}>
                            {status} <span className="font-black">{count}</span>
                        </div>
                    );
                })}
            </div>

            {error && (
                <div className="bg-red-900/20 border border-red-800/30 text-red-400 text-xs px-4 py-3 rounded-sm mb-6 uppercase tracking-wide">
                    {error}
                </div>
            )}

            {displayOrders.length === 0 ? (
                <div className="text-center py-20">
                    <Clock size={40} className="text-zinc-800 mx-auto mb-4" strokeWidth={1} />
                    <p className="text-zinc-600 text-xs uppercase tracking-[0.3em]">
                        {showCompleted ? 'No completed orders yet' : 'No active orders in queue'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayOrders.map((order) => (
                        <div key={order.id} className="bg-zinc-950 border border-zinc-900 rounded-sm overflow-hidden flex flex-col">
                            <div className="px-4 py-3 bg-zinc-900 flex justify-between items-center border-b border-zinc-800">
                                <span className="font-mono text-red-500 font-black text-sm">#{order.order_number}</span>
                                <span className={`text-[9px] px-2 py-1 rounded-sm font-black uppercase border ${STATUS_BADGE[order.status] || STATUS_BADGE['Pending']}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="p-4 flex-1">
                                <ul className="space-y-2">
                                    {order.items?.map((item, idx) => (
                                        <li key={idx} className="flex justify-between text-xs border-b border-zinc-900 pb-2">
                                            <span className="uppercase font-bold text-zinc-300">{item.name}</span>
                                            <span className="text-red-500 font-black">x{item.pivot?.quantity || item.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex justify-between items-center mt-3 pt-2">
                                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Total</span>
                                    <span className="text-sm font-black text-white">₱{parseFloat(order.total_amount).toFixed(2)}</span>
                                </div>
                            </div>

                            {STATUS_FLOW[order.status] && (
                                <div className="p-3 bg-black border-t border-zinc-900 flex gap-2">
                                    <button
                                        onClick={() => updateStatus(order.id, STATUS_FLOW[order.status].next)}
                                        disabled={updating === order.id}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] font-black uppercase tracking-widest transition rounded-sm disabled:opacity-50 ${STATUS_FLOW[order.status].color}`}
                                    >
                                        {updating === order.id ? (
                                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                {STATUS_FLOW[order.status].icon}
                                                {STATUS_FLOW[order.status].label}
                                            </>
                                        )}
                                    </button>
                                    {order.status === 'Pending' && (
                                        <button
                                            onClick={() => updateStatus(order.id, 'Cancelled')}
                                            disabled={updating === order.id}
                                            className="p-2.5 text-zinc-700 hover:text-red-500 hover:bg-red-900/10 rounded-sm transition border border-zinc-900"
                                        >
                                            <XCircle size={14} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderQueue;