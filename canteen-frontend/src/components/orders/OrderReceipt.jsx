import React from 'react';
import { CheckCircle, Printer, X } from 'lucide-react';

const OrderReceipt = ({ order, onClose }) => {
    if (!order) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-sm w-full max-w-sm">
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-900/20 rounded-sm">
                            <CheckCircle size={18} className="text-green-500" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-white">
                                Order Complete
                            </h2>
                            <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-0.5">
                                Transaction Successful
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-600 hover:text-white transition p-1"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Order No.</span>
                        <span className="text-sm font-black text-red-500 font-mono">
                            #{order.order_number}
                        </span>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Date</span>
                        <span className="text-xs text-zinc-400 font-mono">
                            {new Date().toLocaleString()}
                        </span>
                    </div>

                    <div className="border-t border-dashed border-zinc-800 mb-4" />

                    <div className="space-y-2 mb-4">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-bold text-white uppercase">{item.name}</p>
                                    <p className="text-[10px] text-zinc-600 font-mono">
                                        {item.qty} x ₱{parseFloat(item.price).toFixed(2)}
                                    </p>
                                </div>
                                <span className="text-xs font-black text-zinc-300">
                                    ₱{(item.qty * item.price).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-dashed border-zinc-800 mb-4" />

                    <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Total</span>
                        <span className="text-2xl font-black text-white">
                            ₱{parseFloat(order.total).toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="p-4 border-t border-zinc-900 flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex-1 flex items-center justify-center gap-2 border border-zinc-700 py-2.5 text-xs font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 hover:text-white transition rounded-sm"
                    >
                        <Printer size={14} />
                        Print
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-red-600 hover:bg-red-700 py-2.5 text-xs font-black uppercase tracking-widest transition rounded-sm"
                    >
                        New Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderReceipt;