import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingCart, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerMenu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMenu();
        fetchCategories();
    }, []);

    const getToken = () => localStorage.getItem('token');

    const fetchMenu = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/menu-items', {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setMenuItems(res.data);
        } catch (err) {
            console.error('Failed to fetch menu', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/categories', {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setCategories(res.data);
        } catch (err) {
            console.error('Failed to fetch categories', err);
        }
    };

    const addToCart = (item) => {
        const existing = cart.find(i => i.id === item.id);
        if (existing) {
            setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
        } else {
            setCart([...cart, { ...item, qty: 1, price: parseFloat(item.price) }]);
        }
    };

    const filteredItems = menuItems.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = activeCategory === 'all' || item.category_id === Number(activeCategory);
        return matchSearch && matchCategory && item.stock > 0;
    });

    const totalCartItems = cart.reduce((sum, i) => sum + i.qty, 0);

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-4 mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-widest text-white">
                        Our <span className="text-red-600">Menu</span>
                    </h1>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-0.5">
                        Browse and add items to your order
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                        <input
                            type="text"
                            placeholder="Search menu..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-red-600 rounded-sm transition-colors"
                        />
                    </div>
                    <button
                        onClick={() => navigate('/customer/order', { state: { cart } })}
                        disabled={cart.length === 0}
                        className="relative flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded-sm text-xs font-black uppercase tracking-widest transition"
                    >
                        <ShoppingCart size={14} />
                        Order
                        {totalCartItems > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-black text-[10px] font-black rounded-full flex items-center justify-center">
                                {totalCartItems}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-4 py-1.5 text-[10px] font-bold tracking-widest border rounded-sm transition-all whitespace-nowrap ${
                        activeCategory === 'all'
                            ? 'bg-red-600 border-red-600 text-white'
                            : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
                    }`}
                >
                    All
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-1.5 text-[10px] font-bold tracking-widest border rounded-sm transition-all whitespace-nowrap ${
                            activeCategory === cat.id
                                ? 'bg-red-600 border-red-600 text-white'
                                : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredItems.map(item => {
                        const inCart = cart.find(i => i.id === item.id);
                        return (
                            <div key={item.id} className="bg-zinc-950 border border-zinc-800 rounded-sm p-5 hover:border-zinc-600 transition-all group">
                                <div className="mb-3">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                                        {item.category?.name || 'Uncategorized'}
                                    </span>
                                    <h3 className="text-sm font-black uppercase text-white mt-1 group-hover:text-red-500 transition">
                                        {item.name}
                                    </h3>
                                    {item.description && (
                                        <p className="text-[10px] text-zinc-600 mt-1 line-clamp-2">{item.description}</p>
                                    )}
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-xl font-black text-red-500">
                                        ₱{parseFloat(item.price).toFixed(2)}
                                    </span>
                                    <button
                                        onClick={() => addToCart(item)}
                                        className="flex items-center gap-1.5 bg-zinc-800 hover:bg-red-600 px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition"
                                    >
                                        <Plus size={12} />
                                        {inCart ? `(${inCart.qty})` : 'Add'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {filteredItems.length === 0 && (
                        <p className="col-span-full text-center text-zinc-700 text-xs uppercase tracking-widest py-10">
                            No items found.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomerMenu;