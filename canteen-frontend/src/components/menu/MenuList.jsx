import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MenuList = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [activeCategory, setActiveCategory] = useState('all'); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newItem, setNewItem] = useState({ name: '', price: '', stock: '', category_id: 1 });

    const API_URL = 'http://127.0.0.1:8000/api/menu-items';
    const CAT_URL = 'http://127.0.0.1:8000/api/categories';

    useEffect(() => {
        fetchMenu();
        fetchCategories();
    }, []);

    const fetchMenu = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMenuItems(res.data);
    };

    const fetchCategories = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(CAT_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(res.data);
        } catch (err) {
            console.error("Failed to fetch categories", err);
        }
    };

    const filteredItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'all' || item.category_id === Number(activeCategory);
        return matchesSearch && matchesCategory;
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, newItem, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(API_URL, newItem, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            closeModal();
            fetchMenu(); 
        } catch (err) {
            console.error("Operation failed", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            const token = localStorage.getItem('token');
            try {
                await axios.delete(`${API_URL}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMenuItems(menuItems.filter(item => item.id !== id));
            } catch (err) {
                console.error("Delete failed", err);
            }
        }
    };

    const openEditModal = (item) => {
        setEditingId(item.id);
        setNewItem({ name: item.name, price: item.price, stock: item.stock, category_id: item.category_id });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setNewItem({ name: '', price: '', stock: '', category_id: 1 });
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-red-600 pb-4 mb-8 gap-4">
                <h1 className="text-3xl font-bold tracking-widest text-red-600 uppercase">Inventory</h1>
                
                <div className="flex w-full md:w-auto gap-4">
                    <input 
                        type="text" 
                        placeholder="SEARCH PRODUCTS..." 
                        className="bg-zinc-900 border border-zinc-700 px-4 py-2 outline-none focus:border-red-600 w-full md:w-64 text-sm uppercase tracking-tighter"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-sm font-bold transition whitespace-nowrap"
                    >
                        + NEW ITEM
                    </button>
                </div>
            </div>

            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-4 py-1 text-[10px] font-bold tracking-widest border transition-all ${
                        activeCategory === 'all' ? 'bg-red-600 border-red-600 text-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
                    }`}
                >
                    ALL ITEMS
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-1 text-[10px] font-bold tracking-widest border transition-all ${
                            activeCategory === cat.id ? 'bg-red-600 border-red-600 text-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
                        }`}
                    >
                        {cat.name.toUpperCase()}
                    </button>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center p-4 z-50">
                    <div className="bg-zinc-900 border-2 border-red-600 p-8 rounded-lg w-full max-w-md shadow-[0_0_50px_rgba(220,38,38,0.2)]">
                        <h2 className="text-red-500 text-xl font-bold mb-4 uppercase">
                            {editingId ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input 
                                type="text" placeholder="Product Name"
                                value={newItem.name}
                                className="w-full bg-black border border-gray-700 p-2 focus:border-red-500 outline-none"
                                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                                required
                            />
                            
                            <select 
                                value={newItem.category_id}
                                className="w-full bg-black border border-gray-700 p-2 focus:border-red-500 outline-none text-zinc-400"
                                onChange={(e) => setNewItem({...newItem, category_id: e.target.value})}
                                required
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>

                            <input 
                                type="number" placeholder="Price (₱)"
                                value={newItem.price}
                                className="w-full bg-black border border-gray-700 p-2 focus:border-red-500 outline-none"
                                onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                                required
                            />
                            <input 
                                type="number" placeholder="Stock Quantity"
                                value={newItem.stock}
                                className="w-full bg-black border border-gray-700 p-2 focus:border-red-500 outline-none"
                                onChange={(e) => setNewItem({...newItem, stock: e.target.value})}
                                required
                            />
                            <div className="flex gap-4 mt-6">
                                <button type="submit" className="flex-1 bg-red-600 py-2 font-bold hover:bg-red-700 transition">SAVE</button>
                                <button 
                                    type="button" 
                                    onClick={closeModal}
                                    className="flex-1 border border-gray-600 py-2 hover:bg-gray-800 transition"
                                >
                                    CANCEL
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => {
                        const stockPercent = Math.min((item.stock / 100) * 100, 100);
                        const isLow = item.stock < 10;

                        return (
                            <div key={item.id} className="relative overflow-hidden border border-zinc-800 bg-zinc-900 p-5 rounded hover:border-red-600 transition group">
                                {isLow && <div className="absolute top-0 left-0 w-1 h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)]"></div>}
                                
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold group-hover:text-red-500 transition uppercase tracking-tight">{item.name}</h3>
                                        <p className="text-red-600 font-mono text-2xl">₱{item.price}</p>
                                        
                                        <div className="mt-4 pr-4">
                                            <div className="flex justify-between text-[10px] mb-1 uppercase font-bold text-zinc-500">
                                                <span>Level</span>
                                                <span className={isLow ? 'text-red-500 animate-pulse' : ''}>
                                                    {item.stock} Units
                                                </span>
                                            </div>
                                            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-700 ease-out ${isLow ? 'bg-red-600' : 'bg-zinc-400'}`}
                                                    style={{ width: `${stockPercent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => openEditModal(item)} className="text-[10px] border border-gray-600 px-2 py-1 hover:bg-white hover:text-black transition uppercase font-bold">
                                            EDIT
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="text-[10px] border border-red-900 text-red-500 px-2 py-1 hover:bg-red-600 hover:text-white transition uppercase font-bold">
                                            DEL
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-zinc-600 italic col-span-full text-center py-10">No items found matching your search.</p>
                )}
            </div>
        </div>
    );
};

export default MenuList;