import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, CheckCircle, ArrowLeft } from 'lucide-react';

const CustomerOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [cart, setCart] = useState(location.state?.cart || []);
    const [loading, setLoading] = useState(false);
    const [receipt, setReceipt] = useState(null);

    const getToken = () => localStorage.getItem('token');

    const updateQty = (id, qty) => {
        if (qty <= 0) {
            setCart(cart.filter(i => i.id !== id));
            return;
        }
        setCart(cart.map(i => i.id === id ? { ...i, qty } : i));
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const handlePlaceOrder = async () => {
        if (cart.length === 0 || loading) return;
        setLoading(true);
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/orders', {
                items: cart.map(item => ({
                    menu_item_id: item.id,
                    quantity: item.qty,
                    price: item.price,
                })),
                total_amount: total,
            }, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });

            setReceipt({
                order_number: res.data.order_number,
                items: cart,
                total,
            });
            setCart([]);
        } catch (err) {
            alert(err.response?.data?.message || 'Order failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (receipt) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
                <div className="bg-zinc-950 border border-zinc-800 rounded-sm w-full max-w-sm p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-900/20 rounded-sm">
                            <CheckCircle size={20} className="text-green-500" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-white">Order Placed!</h2>
                            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Your order is being prepared</p>
                        </div>
                    </div>

                    <div className="flex justify-between mb-4">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Order No.</span>
                        <span className="text-sm font-black text-red-500 font-mono">#{receipt.order_number}</span>
                    </div>

                    <div className="border-t border-dashed border-zinc-800 py-4 space-y-2 mb-4">
                        {receipt.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-xs">
                                <span className="text-zinc-300 uppercase font-bold">{item.name} x{item.qty}</span>
                                <span className="text-zinc-400">₱{(item.price * item.qty).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between border-t border-zinc-800 pt-4 mb-6">
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Total</span>
                        <span className="text-xl font-black text-white">₱{receipt.total.toFixed(2)}</span>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/customer/history')}
                            className="flex-1 border border-zinc-700 py-2.5 text-xs font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 hover:text-white transition rounded-sm"
                        >
                            My Orders
                        </button>
                        <button
                            onClick={() => navigate('/customer/menu')}
                            className="flex-1 bg-red-600 hover:bg-red-700 py-2.5 text-xs font-black uppercase tracking-widest transition rounded-sm"
                        >
                            Order More
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="flex items-center gap-4 border-b border-zinc-800 pb-4 mb-6">
                <button
                    onClick={() => navigate('/customer/menu')}
                    className="text-zinc-600 hover:text-white transition p-1"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-widest text-white">
                        Your <span className="text-red-600">Order</span>
                    </h1>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-0.5">
                        Review and confirm your order
                    </p>
                </div>
            </div>

            {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <ShoppingCart size={40} className="text-zinc-800" strokeWidth={1} />
                    <p className="text-zinc-700 text-xs uppercase tracking-widest">Your cart is empty</p>
                    <button
                        onClick={() => navigate('/customer/menu')}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-xs font-black uppercase tracking-widest rounded-sm transition"
                    >
                        Browse Menu
                    </button>
                </div>
            ) : (
                <div className="max-w-lg mx-auto">
                    <div className="space-y-3 mb-6">
                        {cart.map(item => (
                            <div key={item.id} className="bg-zinc-950 border border-zinc-800 rounded-sm p-4 flex items-center gap-4">
                                <div className="flex-1">
                                    <p className="text-sm font-black uppercase text-white">{item.name}</p>
                                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">₱{item.price.toFixed(2)} each</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQty(item.id, item.qty - 1)}
                                        className="w-6 h-6 bg-zinc-800 hover:bg-zinc-700 rounded-sm text-xs font-black flex items-center justify-center transition"
                                    >
                                        −
                                    </button>
                                    <span className="text-sm font-black w-5 text-center">{item.qty}</span>
                                    <button
                                        onClick={() => updateQty(item.id, item.qty + 1)}
                                        className="w-6 h-6 bg-zinc-800 hover:bg-zinc-700 rounded-sm text-xs font-black flex items-center justify-center transition"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-sm font-black text-red-500 w-20 text-right">
                                    ₱{(item.price * item.qty).toFixed(2)}
                                </span>
                                <button
                                    onClick={() => updateQty(item.id, 0)}
                                    className="text-zinc-700 hover:text-red-500 transition"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Total Amount</span>
                            <span className="text-3xl font-black text-white">₱{total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-40 py-3 text-xs font-black uppercase tracking-widest transition rounded-sm"
                        >
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerOrder;