import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RefreshCw, Clock, CheckCircle, XCircle, Package } from 'lucide-react';

const STATUS_STYLE = {
    'Pending':   'bg-amber-900/20 text-amber-400 border-amber-800/30',
    'Preparing': 'bg-blue-900/20 text-blue-400 border-blue-800/30',
    'Ready':     'bg-green-900/20 text-green-400 border-green-800/30',
    'Completed': 'bg-zinc-800 text-zinc-400 border-zinc-700',
    'Cancelled': 'bg-red-900/20 text-red-400 border-red-800/30',
};

const STATUS_ICON = {
    'Pending':   <Clock size={12} />,
    'Preparing': <Package size={12} />,
    'Ready':     <CheckCircle size={12} />,
    'Completed': <CheckCircle size={12} />,
    'Cancelled': <XCircle size={12} />,
};

const CustomerHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 15000);
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

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-widest text-white">
                        Order <span className="text-red-600">History</span>
                    </h1>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-0.5">
                        Your past and active orders
                    </p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="p-2 text-zinc-600 hover:text-white hover:bg-zinc-900 rounded-sm transition"
                >
                    <RefreshCw size={16} />
                </button>
            </div>

            {error && (
                <div className="bg-red-900/20 border border-red-800/30 text-red-400 text-xs px-4 py-3 rounded-sm mb-6">
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Package size={40} className="text-zinc-800" strokeWidth={1} />
                    <p className="text-zinc-700 text-xs uppercase tracking-widest">No orders yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden">
                            <div className="px-5 py-3 bg-zinc-900 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-black text-red-500 font-mono">
                                        #{order.order_number}
                                    </span>
                                    <span className="text-[10px] text-zinc-600 font-mono">
                                        {new Date(order.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm border ${STATUS_STYLE[order.status] || STATUS_STYLE['Pending']}`}>
                                    {STATUS_ICON[order.status]}
                                    {order.status}
                                </span>
                            </div>

                            <div className="px-5 py-4">
                                <div className="space-y-1 mb-4">
                                    {order.items?.map((item, i) => (
                                        <div key={i} className="flex justify-between text-xs">
                                            <span className="text-zinc-300 uppercase font-bold">
                                                {item.name}
                                                <span className="text-zinc-600 ml-2">x{item.pivot?.quantity || item.quantity}</span>
                                            </span>
                                            <span className="text-zinc-500 font-mono">
                                                ₱{((item.pivot?.price || item.price) * (item.pivot?.quantity || item.quantity)).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center border-t border-zinc-800 pt-3">
                                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Total</span>
                                    <span className="text-sm font-black text-white">
                                        ₱{parseFloat(order.total_amount).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerHistory;