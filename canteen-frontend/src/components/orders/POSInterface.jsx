import React, { useEffect, useState } from 'react';
import axios from 'axios';
import s from './POSStyles.module.css';
import { ShoppingCart, Trash2, Loader2, Package, LayoutGrid } from 'lucide-react';

const POSInterface = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => { fetchMenu(); }, []);

    const getToken = () => localStorage.getItem('token');

    const fetchMenu = async () => {
        setFetching(true);
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/menu-items", {
                headers: { 
                    Authorization: `Bearer ${getToken()}`, 
                    Accept: "application/json" 
                }
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
        setLoading(true);
        try {
            const payload = {
                items: cart.map(item => ({ 
                    menu_item_id: item.id, 
                    quantity: item.qty, 
                    price: item.price 
                })),
                total_amount: total
            };
            await axios.post("http://127.0.0.1:8000/api/orders", payload, {
                headers: { 
                    Authorization: `Bearer ${getToken()}`, 
                    Accept: "application/json" 
                }
            });
            alert("Order completed successfully!");
            setCart([]);
            fetchMenu();
        } catch (err) {
            alert(err.response?.data?.message || "Order failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={s.posRoot}>
            {/* MAIN GRID */}
            <div className={s.productSection}>
                <header className={s.posHeader}>
                    <div className="flex items-center gap-3">
                        <LayoutGrid className="text-[#FF2D20]" size={24} />
                        <div>
                            <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">
                                CANTEEN <span className="text-[#FF2D20]">POS</span>
                            </h1>
                            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Terminal 01</p>
                        </div>
                    </div>
                    {fetching && <Loader2 className="animate-spin text-[#FF2D20]" size={20} />}
                </header>

                <div className={s.productGrid}>
                    {menuItems.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => addToCart(item)} 
                            className={`${s.productCard} ${item.stock <= 0 ? 'opacity-25 grayscale cursor-not-allowed' : ''}`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2">
                                    <Package size={14} className="text-zinc-500" />
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Stock</span>
                                </div>
                                <span className="text-[10px] font-black text-white">{item.stock}</span>
                            </div>
                            <h3 className="font-bold text-zinc-200 text-sm uppercase tracking-tight">{item.name}</h3>
                            <p className={s.priceText}>₱{item.price}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* SIDEBAR */}
            <aside className={s.manifestSidebar}>
                <div className="flex items-center gap-3 pb-5 border-b border-zinc-900">
                    <ShoppingCart size={20} className="text-[#FF2D20]" />
                    <h2 className="font-black text-white uppercase text-xs tracking-[0.2em]">Active_Order</h2>
                </div>

                <div className={s.cartList}>
                    {cart.map(item => (
                        <div key={item.id} className={s.manifestItem}>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-white uppercase leading-tight mb-1">{item.name}</p>
                                <p className="text-[10px] text-zinc-500 font-mono italic">{item.qty} units x ₱{item.price}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-black text-[#FF2D20]">₱{(item.price * item.qty).toFixed(2)}</span>
                                <button onClick={() => removeFromCart(item.id)} className="text-zinc-700 hover:text-white transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {cart.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center opacity-20">
                            <ShoppingCart size={40} strokeWidth={1} />
                            <p className="text-[9px] uppercase font-bold mt-2">No Items in Cart</p>
                        </div>
                    )}
                </div>

                {/* FOOTER / TOTAL */}
                <div className={s.summarySection}>
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Grand Total</span>
                            <span className="text-4xl font-black text-white tracking-tighter">
                                ₱{total.toFixed(2)}
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={handlePlaceOrder} 
                        disabled={cart.length === 0 || loading} 
                        className={s.btnCommit}
                    >
                        {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Complete Transaction"}
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default POSInterface;