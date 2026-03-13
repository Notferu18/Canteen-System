import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LowStockAlert = ({ items = [], onDismiss, threshold = 20 }) => {
    const navigate = useNavigate();
    const lowItems = items.filter(item => item.stock < threshold);

    if (lowItems.length === 0) return null;

    return (
        <div className="bg-amber-950/20 border border-amber-800/40 rounded-sm p-4 mb-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-amber-900/30 rounded-sm mt-0.5">
                        <AlertTriangle size={16} className="text-amber-500" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-1">
                            Low Stock Warning — {lowItems.length} {lowItems.length === 1 ? 'item' : 'items'}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {lowItems.map(item => (
                                <span
                                    key={item.id}
                                    className="text-[10px] font-bold uppercase tracking-wide bg-amber-900/20 border border-amber-800/30 text-amber-400 px-2 py-0.5 rounded-sm"
                                >
                                    {item.name}
                                    <span className="ml-1.5 text-amber-600">({item.stock} left)</span>
                                </span>
                            ))}
                        </div>
                        <button
                            onClick={() => navigate('/inventory')}
                            className="mt-3 text-[10px] font-black uppercase tracking-widest text-amber-500 hover:text-amber-300 transition-colors underline underline-offset-2"
                        >
                            Go to Inventory →
                        </button>
                    </div>
                </div>

                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="text-amber-800 hover:text-amber-500 transition-colors flex-shrink-0"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default LowStockAlert;