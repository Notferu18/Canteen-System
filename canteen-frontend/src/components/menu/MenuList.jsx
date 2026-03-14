import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MenuForm from './MenuForm';
import MenuItemCard from './MenuItemCard';

const MenuList = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newItem, setNewItem] = useState({ name: '', price: '', stock: '', category_id: '' });

    const API_URL = 'http://127.0.0.1:8000/api/menu-items';
    const CAT_URL = 'http://127.0.0.1:8000/api/categories';

    useEffect(() => {
        fetchMenu();
        fetchCategories();
    }, []);

    const fetchMenu = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMenuItems(res.data);
        } catch (err) {
            console.error("Failed to fetch menu", err);
        }
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
        const formData = new FormData();
        formData.append('name', newItem.name);
        formData.append('price', newItem.price);
        formData.append('stock', newItem.stock);
        formData.append('category_id', newItem.category_id);
        if (newItem.description) formData.append('description', newItem.description);
        if (newItem.image) formData.append('image', newItem.image);
        if (editingId) formData.append('_method', 'PUT');

        const url = editingId ? `${API_URL}/${editingId}` : API_URL;
        await axios.post(url, formData, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
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
        setNewItem({ name: '', price: '', stock: '', category_id: '' });
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col">

            <div className="flex flex-col md:flex-row justify-between items-center border-b border-zinc-800 pb-4 mb-6 gap-4">
                <h1 className="text-2xl font-black tracking-widest text-white uppercase">
                    Menu <span className="text-red-600">Items</span>
                </h1>
                <div className="flex w-full md:w-auto gap-3">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="bg-zinc-950 border border-zinc-800 px-4 py-2 outline-none focus:border-red-600 w-full md:w-64 text-sm text-white placeholder-zinc-600 rounded-sm transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-sm font-bold text-xs uppercase tracking-widest transition whitespace-nowrap"
                    >
                        + New Item
                    </button>
                </div>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 flex-shrink-0">
                <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-4 py-1.5 text-[10px] font-bold tracking-widest border rounded-sm transition-all whitespace-nowrap ${
                        activeCategory === 'all'
                            ? 'bg-red-600 border-red-600 text-white'
                            : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                    }`}
                >
                    All Items
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-1.5 text-[10px] font-bold tracking-widest border rounded-sm transition-all whitespace-nowrap ${
                            activeCategory === cat.id
                                ? 'bg-red-600 border-red-600 text-white'
                                : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className="overflow-y-auto flex-1 pr-1" style={{ maxHeight: 'calc(100vh - 220px)' }}>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <MenuItemCard
                                key={item.id}
                                item={item}
                                onEdit={openEditModal}
                                onDelete={handleDelete}
                                onRefresh={fetchMenu} 
                            />
                        ))
                    ) : (
                        <p className="text-zinc-700 text-xs col-span-full text-center py-10 uppercase tracking-widest">
                            No items found.
                        </p>
                    )}
                </div>
            </div>

            <MenuForm
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                categories={categories}
                editingId={editingId}
                newItem={newItem}
                setNewItem={setNewItem}
            />
        </div>
    );
};

export default MenuList;