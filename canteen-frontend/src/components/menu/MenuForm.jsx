import React, { useState } from 'react';
import { ImagePlus, X } from 'lucide-react';

const MenuForm = ({ isOpen, onClose, onSubmit, categories, editingId, newItem, setNewItem }) => {
    const [imagePreview, setImagePreview] = useState(null);

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setNewItem({ ...newItem, image: file });
        setImagePreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setNewItem({ ...newItem, image: null });
        setImagePreview(null);
    };

    return (
        <div className="fixed inset-0 bg-black/75 flex justify-center items-center p-4 z-50">
            <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-sm w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-white text-sm font-black mb-6 uppercase tracking-widest">
                    {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <form onSubmit={onSubmit} className="space-y-3" encType="multipart/form-data">
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={newItem.name}
                        className="w-full bg-black border border-zinc-800 p-3 focus:border-red-600 outline-none text-white text-sm placeholder-zinc-700 rounded-sm transition-colors"
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        required
                    />

                    <textarea
                        placeholder="Description (optional)"
                        value={newItem.description || ''}
                        rows={2}
                        className="w-full bg-black border border-zinc-800 p-3 focus:border-red-600 outline-none text-white text-sm placeholder-zinc-700 rounded-sm transition-colors resize-none"
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
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

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">
                            Item Photo (optional)
                        </label>
                        {imagePreview || (editingId && newItem.existingImage) ? (
                            <div className="relative w-full h-36 rounded-sm overflow-hidden border border-zinc-800">
                                <img
                                    src={imagePreview || newItem.existingImage}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white p-1 rounded-sm transition"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-28 border border-dashed border-zinc-700 hover:border-red-600 rounded-sm cursor-pointer transition-colors bg-black/20">
                                <ImagePlus size={20} className="text-zinc-600 mb-2" />
                                <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Click to upload image</span>
                                <span className="text-[9px] text-zinc-700 mt-1">JPG, PNG, WEBP — max 2MB</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        )}
                    </div>

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