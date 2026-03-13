import React from 'react';

const MenuForm = ({ isOpen, onClose, onSubmit, categories, editingId, newItem, setNewItem }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/75 flex justify-center items-center p-4 z-50">
            <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-sm w-full max-w-md">
                <h2 className="text-white text-sm font-black mb-6 uppercase tracking-widest">
                    {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <form onSubmit={onSubmit} className="space-y-3">
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={newItem.name}
                        className="w-full bg-black border border-zinc-800 p-3 focus:border-red-600 outline-none text-white text-sm placeholder-zinc-700 rounded-sm transition-colors"
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        required
                    />

                    <select
                        value={newItem.category_id}
                        className="w-full bg-black border border-zinc-800 p-3 focus:border-red-600 outline-none text-sm rounded-sm transition-colors text-white"
                        onChange={(e) => setNewItem({ ...newItem, category_id: e.target.value })}
                        required
                    >
                        <option value="" disabled>Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Price (₱)"
                        value={newItem.price}
                        className="w-full bg-black border border-zinc-800 p-3 focus:border-red-600 outline-none text-white text-sm placeholder-zinc-700 rounded-sm transition-colors"
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Stock Quantity"
                        value={newItem.stock}
                        className="w-full bg-black border border-zinc-800 p-3 focus:border-red-600 outline-none text-white text-sm placeholder-zinc-700 rounded-sm transition-colors"
                        onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                        required
                    />

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            className="flex-1 bg-red-600 hover:bg-red-700 py-2.5 font-black text-xs uppercase tracking-widest transition rounded-sm"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-zinc-700 py-2.5 hover:bg-zinc-900 transition text-xs uppercase font-black tracking-widest text-zinc-400 rounded-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MenuForm;