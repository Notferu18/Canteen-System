import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PackagePlus, AlertCircle, RefreshCw, Search } from 'lucide-react';

const InventoryTable = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/menu-items', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItems(res.data);
        } catch (err) {
            console.error('Failed to fetch inventory', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRestock = async (id, currentStock) => {
        const amount = prompt("Enter amount to add:", "20");
        if (!amount || isNaN(amount)) return;

        const token = localStorage.getItem('token');
        try {
            await axios.post('http://127.0.0.1:8000/api/inventory/adjust',
                { menu_item_id: id, change_amount: parseInt(amount), reason: 'Manual restock' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchInventory();
        } catch (err) {
            alert("Restock failed.");
        }
    };

    const lowStockItems = items.filter(item => item.stock < 20);

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all'
            ? true
            : statusFilter === 'low'
            ? item.stock < 20
            : item.stock >= 20;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-8 bg-black min-h-screen text-white">
            {lowStockItems.length > 0 && (
                <div className="mb-6 bg-red-900/20 border border-red-800/40 p-4 rounded-sm flex items-center gap-4">
                    <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                    <div>
                        <h3 className="text-red-500 font-bold uppercase text-xs tracking-widest">Critical Stock Alert</h3>
                        <p className="text-xs text-zinc-400 uppercase mt-0.5">
                            {lowStockItems.length} {lowStockItems.length === 1 ? 'item is' : 'items are'} running low. Restock immediately.
                        </p>
                    </div>
                </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-widest text-white">Inventory</h1>
                    <p className="text-zinc-500 text-xs uppercase tracking-tighter mt-0.5">Stock Management & Supply Tracking</p>
                </div>
                <button onClick={fetchInventory} className="p-2 text-zinc-500 hover:text-red-500 transition">
                    <RefreshCw size={18} />
                </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                        type="text"
                        placeholder="Search by name or category..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-red-600 rounded-sm transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'low', 'stable'].map(f => (
                        <button
                            key={f}
                            onClick={() => setStatusFilter(f)}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm border transition ${
                                statusFilter === f
                                    ? f === 'low'
                                        ? 'bg-red-600 border-red-600 text-white'
                                        : 'bg-zinc-800 border-zinc-700 text-white'
                                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
                            }`}
                        >
                            {f === 'all' ? `All (${items.length})` : f === 'low' ? `Low (${lowStockItems.length})` : `Stable (${items.length - lowStockItems.length})`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto border border-zinc-800 rounded-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-900 text-zinc-500 uppercase text-[10px] tracking-widest border-b border-zinc-800">
                            <th className="p-4">Item Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4 text-center">Current Stock</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-mono">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-zinc-600 text-xs uppercase tracking-widest">
                                    Loading...
                                </td>
                            </tr>
                        ) : filteredItems.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-zinc-700 text-xs uppercase tracking-widest">
                                    No items found.
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map((item) => (
                                <tr key={item.id} className="border-b border-zinc-900 hover:bg-zinc-950 transition">
                                    <td className="p-4 font-bold uppercase">{item.name}</td>
                                    <td className="p-4 text-zinc-500 uppercase">{item.category?.name || 'Uncategorized'}</td>
                                    <td className={`p-4 text-center font-black ${item.stock < 20 ? 'text-red-500' : 'text-zinc-300'}`}>
                                        {item.stock}
                                    </td>
                                    <td className="p-4">
                                        {item.stock < 20 ? (
                                            <span className="text-[10px] bg-red-600/20 text-red-400 border border-red-800/30 px-2 py-0.5 rounded-sm font-black uppercase">Low</span>
                                        ) : (
                                            <span className="text-[10px] bg-zinc-800 text-zinc-400 border border-zinc-700 px-2 py-0.5 rounded-sm font-black uppercase">Stable</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleRestock(item.id, item.stock)}
                                            className="inline-flex items-center gap-2 text-xs font-bold uppercase bg-zinc-800 hover:bg-red-600 px-3 py-1.5 transition rounded-sm"
                                        >
                                            <PackagePlus size={14} /> Restock
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryTable;