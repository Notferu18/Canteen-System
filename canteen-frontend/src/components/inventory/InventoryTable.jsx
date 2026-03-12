import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PackagePlus, AlertCircle, RefreshCw } from 'lucide-react';

const InventoryTable = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:8000/api/menu-items', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setItems(res.data);
        setLoading(false);
    };

    const handleRestock = async (id, currentStock) => {
        const amount = prompt("Enter amount to add:", "10");
        if (!amount || isNaN(amount)) return;

        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://127.0.0.1:8000/api/menu-items/${id}`, 
                { stock: parseInt(currentStock) + parseInt(amount) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchInventory(); 
        } catch (err) {
            alert("Restock failed.");
        }
    };

    const lowStockItems = items.filter(item => item.stock < 10);

    return (
        <div className="p-8 bg-black min-h-screen text-white">
            {lowStockItems.length > 0 && (
                <div className="mb-8 bg-red-900/20 border border-red-600 p-4 rounded-sm flex items-center gap-4 animate-pulse">
                    <AlertCircle className="text-red-500" size={24} />
                    <div>
                        <h3 className="text-red-500 font-bold uppercase text-sm tracking-widest">Critical Stock Alert</h3>
                        <p className="text-xs text-zinc-400 uppercase">
                            {lowStockItems.length} items are running low. Restock immediately.
                        </p>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-widest text-white">Inventory_Log</h1>
                    <p className="text-zinc-500 text-xs uppercase tracking-tighter">Stock Management & Supply Tracking</p>
                </div>
                <button onClick={fetchInventory} className="p-2 text-zinc-500 hover:text-red-500 transition">
                    <RefreshCw size={20} />
                </button>
            </div>

            <div className="overflow-x-auto border border-zinc-800">
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
                        {items.map((item) => (
                            <tr key={item.id} className="border-b border-zinc-900 hover:bg-zinc-950 transition">
                                <td className="p-4 font-bold uppercase">{item.name}</td>
                                <td className="p-4 text-zinc-500 uppercase">{item.category?.name || 'Uncategorized'}</td>
                                <td className={`p-4 text-center font-black ${item.stock < 10 ? 'text-red-500' : 'text-zinc-300'}`}>
                                    {item.stock}
                                </td>
                                <td className="p-4">
                                    {item.stock < 10 ? (
                                        <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 font-black uppercase">Low</span>
                                    ) : (
                                        <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 font-black uppercase">Stable</span>
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryTable;