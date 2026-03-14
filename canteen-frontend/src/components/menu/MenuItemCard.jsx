import React from 'react';
import axios from 'axios';

const MenuItemCard = ({ item, onEdit, onDelete, onRefresh }) => {
    const stockPercent = Math.min((item.stock / 100) * 100, 100);
    const isLow = item.stock < 20;
    const isAvailable = item.availability === 1 || item.availability === true;

    const handleToggleAvailability = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.patch(
                `http://127.0.0.1:8000/api/menu-items/${item.id}/toggle-availability`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error('Failed to toggle availability', err);
        }
    };

    return (
        <div className={`relative overflow-hidden border ${isAvailable ? 'border-zinc-800' : 'border-zinc-900 opacity-60'} bg-zinc-950 p-5 rounded-sm hover:border-zinc-600 transition-all group`}>
            {isLow && isAvailable && (
                <div className="absolute top-0 left-0 w-0.5 h-full bg-red-600" />
            )}

            <div className="flex items-center justify-between mb-3">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                    isAvailable
                        ? 'bg-green-900/20 text-green-500 border border-green-800/30'
                        : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                }`}>
                    {isAvailable ? 'Available' : 'Unavailable'}
                </span>
            </div>

            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="text-sm font-bold group-hover:text-red-500 transition uppercase tracking-tight leading-tight mb-1">
                        {item.name}
                    </h3>
                    <p className="text-red-500 font-mono text-xl font-black">
                        ₱{parseFloat(item.price).toFixed(2)}
                    </p>

                    <div className="mt-4 pr-2">
                        <div className="flex justify-between text-[10px] mb-1 uppercase font-bold text-zinc-600">
                            <span>Stock</span>
                            <span className={isLow ? 'text-red-500' : 'text-zinc-400'}>
                                {item.stock} units
                            </span>
                        </div>
                        <div className="h-0.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-700 ${isLow ? 'bg-red-600' : 'bg-zinc-500'}`}
                                style={{ width: `${stockPercent}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5 ml-3">
                    <button
                        onClick={() => onEdit(item)}
                        className="text-[9px] border border-zinc-700 px-2 py-1 hover:bg-zinc-800 hover:text-white transition uppercase font-bold text-zinc-400 rounded-sm"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleToggleAvailability}
                        className={`text-[9px] border px-2 py-1 transition uppercase font-bold rounded-sm ${
                            isAvailable
                                ? 'border-zinc-700 text-zinc-500 hover:bg-zinc-800 hover:text-white'
                                : 'border-green-800/40 text-green-600 hover:bg-green-900/20'
                        }`}
                    >
                        {isAvailable ? 'Disable' : 'Enable'}
                    </button>
                    <button
                        onClick={() => onDelete(item.id)}
                        className="text-[9px] border border-zinc-800 text-zinc-600 px-2 py-1 hover:bg-red-600 hover:text-white hover:border-red-600 transition uppercase font-bold rounded-sm"
                    >
                        Del
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;