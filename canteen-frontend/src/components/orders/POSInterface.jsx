import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './POSStyles.module.css';
import { ShoppingCart, Trash2, Loader2, Package, Search } from 'lucide-react';

const POSInterface = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => { fetchMenu(); }, []);

    const fetchMenu = async () => {
        setFetching(true);
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/menu-items', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMenuItems(res.data);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setFetching(false);
        }
    };

    const addToCart = (item) => {
        if (item.stock <= 0) return;
        const existing = cart.find(i => i.id === item.id);
        if (existing) {
            setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
        } else {
            setCart([...cart, { ...item, qty: 1 }]);
        }
    };

    const removeFromCart = (id) => setCart(cart.filter(i => i.id !== id));
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const handlePlaceOrder = async () => {
        if (loading || cart.length === 0) return;
        const token = localStorage.getItem('token');
        setLoading(true);
        try {
            const payload = {
                items: cart.map(item => ({ id: item.id, qty: item.qty, price: item.price })),
                total: total
            };
            await axios.post('http://127.0.0.1:8000/api/orders', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Success: Order Synced to Database.");
            setCart([]);
            fetchMenu();
        } catch (err) {
            alert(err.response?.data?.message || "Error Syncing Order.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pos-root">
            <div className="product-section">
                <header className="pos-header">
                    <div>
                        <h1 className="text-xl font-black text-slate-800 tracking-tight">Canteen_POS</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Store_Front_V1</p>
                    </div>
                    {fetching && <Loader2 className="animate-spin text-blue-600" size={20} />}
                </header>

                <div className="product-grid">
                    {menuItems.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => addToCart(item)}
                            className={`product-card ${item.stock <= 0 ? 'product-card-disabled' : ''}`}
                        >
                            <div className="flex justify-between items-start">
                                <Package size={18} className={item.stock > 0 ? "text-blue-500" : "text-slate-400"} />
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {item.stock > 0 ? 'In Stock' : 'Out'}
                                </span>
                            </div>
                            
                            <h3 className="font-bold text-slate-700 mt-4 leading-tight">{item.name}</h3>
                            <p className="price-text">₱{item.price}</p>
                            
                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Availability</span>
                                <span className="text-xs font-black text-slate-700">{item.stock}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <aside className="manifest-sidebar">
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                    <ShoppingCart size={20} className="text-blue-600" />
                    <h2 className="font-black text-slate-800 uppercase text-xs tracking-widest">Active_Manifest</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.map(item => (
                        <div key={item.id} className="manifest-item">
                            <div>
                                <p className="text-sm font-bold text-slate-800 uppercase">{item.name}</p>
                                <p className="text-[11px] text-slate-500 font-medium">{item.qty} units x ₱{item.price}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-black text-blue-600">₱{(item.price * item.qty).toFixed(2)}</span>
                                <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {cart.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center py-20 opacity-20 italic text-sm">
                            <p>No Items Selected</p>
                        </div>
                    )}
                </div>

                {/* TOTAL & CHECKOUT */}
                <div className="p-6 bg-slate-50 border-t border-slate-200">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-[10px] text-slate-400 font-black uppercase">Grand_Total</span>
                        <span className="text-3xl font-black text-slate-900 tracking-tighter">₱{total.toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={handlePlaceOrder}
                        disabled={cart.length === 0 || loading}
                        className="btn-commit"
                    >
                        {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Complete Transaction"}
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default POSInterface;