import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, Play, Package } from 'lucide-react';

const OrderQueue = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:8000/api/orders', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
    };

    const updateStatus = async (orderId, newStatus) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://127.0.0.1:8000/api/orders/${orderId}`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchOrders(); 
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const activeOrders = orders.filter(order => order.status !== 'Completed');

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="border-b border-red-600 pb-4 mb-8">
                <h1 className="text-3xl font-black uppercase tracking-widest text-red-600 flex items-center gap-3">
                    <Clock size={32} /> Live_Order_Queue
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeOrders.map((order) => (
                    <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden flex flex-col">
                        <div className="p-4 bg-zinc-800 flex justify-between items-center">
                            <span className="font-mono text-red-500 font-bold">#{order.order_number}</span>
                            <span className={`text-[10px] px-2 py-1 rounded font-black uppercase ${
                                order.status === 'Pending' ? 'bg-amber-600 text-white' : 
                                order.status === 'Preparing' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                            }`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="p-4 flex-1">
                            <ul className="space-y-2">
                                {order.items?.map((item, idx) => (
                                    <li key={idx} className="flex justify-between text-sm border-b border-zinc-800 pb-1">
                                        <span className="uppercase font-semibold">{item.name}</span>
                                        <span className="text-red-500 font-bold">x{item.quantity}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-2 bg-zinc-950 grid grid-cols-2 gap-2">
                            {order.status === 'Pending' && (
                                <button 
                                    onClick={() => updateStatus(order.id, 'Preparing')}
                                    className="col-span-2 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-red-600 py-2 text-xs font-bold uppercase transition"
                                >
                                    <Play size={14} /> Start Preparing
                                </button>
                            )}
                            {order.status === 'Preparing' && (
                                <button 
                                    onClick={() => updateStatus(order.id, 'Ready')}
                                    className="col-span-2 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-700 py-2 text-xs font-bold uppercase transition"
                                >
                                    <Package size={14} /> Mark as Ready
                                </button>
                            )}
                            {order.status === 'Ready' && (
                                <button 
                                    onClick={() => updateStatus(order.id, 'Completed')}
                                    className="col-span-2 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-600 py-2 text-xs font-bold uppercase transition"
                                >
                                    <CheckCircle size={14} /> Complete Order
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {activeOrders.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-zinc-600 italic uppercase tracking-[0.3em]">No active orders in queue</p>
                </div>
            )}
        </div>
    );
};

export default OrderQueue;