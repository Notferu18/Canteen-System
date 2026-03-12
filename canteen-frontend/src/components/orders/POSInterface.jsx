import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingCart, Trash2 } from 'lucide-react';

const POSInterface = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:8000/api/menu-items', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMenuItems(res.data);
    };

    const addToCart = (item) => {
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
        const token = localStorage.getItem('token');
        try {
            const payload = {
                items: cart,
                total: total
            };

            await axios.post('http://127.0.0.1:8000/api/orders', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Order placed successfully!");
            setCart([]); 
            fetchMenu();
        } catch (err) {
            console.error("Order failed", err);
            alert("Failed to place order. Check if backend is running.");
        }
    };

    return (
        <div className="flex h-screen bg-black text-white">
            <div className="flex-1 p-6 overflow-y-auto">
                <h1 className="text-2xl font-black uppercase tracking-[0.2em] border-b border-red-600 pb-2 mb-6">
                    Terminal_Order_Entry
                </h1>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {menuItems.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => addToCart(item)}
                            className="bg-zinc-900 border border-zinc-800 p-4 rounded-sm cursor-pointer hover:border-red-600 transition group"
                        >
                            <h3 className="font-bold uppercase text-xs tracking-widest group-hover:text-red-500">{item.name}</h3>
                            <p className="text-red-600 font-mono text-lg font-black">₱{item.price}</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Inventory_Level: {item.stock}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-80 bg-zinc-950 border-l border-zinc-800 flex flex-col">
                <div className="p-4 border-b border-zinc-800 flex items-center gap-2">
                    <ShoppingCart size={20} className="text-red-600" />
                    <h2 className="font-black uppercase tracking-widest text-xs">Active_Manifest</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-zinc-900 p-3 rounded-sm border border-zinc-800">
                            <div>
                                <p className="text-xs font-black uppercase">{item.name}</p>
                                <p className="text-[10px] text-zinc-500 font-mono">{item.qty}x @ ₱{item.price}</p>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-zinc-600 hover:text-red-500 transition">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {cart.length === 0 && (
                        <div className="mt-20 text-center opacity-20">
                            <p className="text-[10px] uppercase font-black tracking-[0.3em]">No_Items_Queued</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-red-600 bg-zinc-900 shadow-2xl">
                    <div className="flex justify-between mb-4">
                        <span className="uppercase text-[10px] text-zinc-400 font-black tracking-widest">Aggregate_Total</span>
                        <span className="text-xl font-mono text-red-500 font-black">₱{total.toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={handlePlaceOrder}
                        disabled={cart.length === 0}
                        className="w-full bg-red-600 py-4 text-xs font-black uppercase tracking-[0.3em] hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-600 transition duration-200 active:scale-95"
                    >
                        Commit_Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default POSInterface; 