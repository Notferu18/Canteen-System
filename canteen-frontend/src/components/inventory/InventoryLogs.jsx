import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RefreshCw, History } from 'lucide-react';

const InventoryLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://127.0.0.1:8000/api/inventory/logs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(res.data);
            setError(null);
        } catch (err) {
            setError('Failed to load reports.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getActionStyle = (log) => {
        const amount = log.change_amount ?? log.quantity ?? 0;
        if (amount > 0) return { style: 'bg-green-900/20 text-green-400 border-green-800/30', label: 'RESTOCK' };
        if (amount < 0) return { style: 'bg-red-900/20 text-red-400 border-red-800/30', label: 'DEDUCTION' };
        return { style: 'bg-zinc-800 text-zinc-400 border-zinc-700', label: 'ADJUSTMENT' };
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-600 text-xs uppercase tracking-widest">Loading audit trail...</p>
            </div>
        </div>
    );

    return (
        <div className="h-screen overflow-y-auto bg-black text-white p-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-widest text-white flex items-center gap-3">
                        <History size={24} className="text-red-600" />
                        Audit<span className="text-red-600">Trail</span>
                    </h1>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-0.5">
                        Complete stock change history
                    </p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="p-2 text-zinc-600 hover:text-white hover:bg-zinc-900 rounded-sm transition"
                >
                    <RefreshCw size={16} />
                </button>
            </div>

            {error && (
                <div className="bg-red-900/20 border border-red-800/30 text-red-400 text-xs px-4 py-3 rounded-sm mb-6 uppercase tracking-wide">
                    {error}
                </div>
            )}

            <div className="border border-zinc-900 rounded-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-950 border-b border-zinc-900">
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Timestamp</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Item</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Action</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Qty Change</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Reason</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Performed By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-zinc-700 text-xs uppercase tracking-widest">
                                        No logs found.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => {
                                    const amount = log.change_amount ?? log.quantity ?? 0;
                                    const { style, label } = getActionStyle(log);
                                    return (
                                        <tr key={log.id} className="border-b border-zinc-900 hover:bg-zinc-950 transition">
                                            <td className="p-4 text-xs text-zinc-500 font-mono whitespace-nowrap">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="p-4 text-sm font-bold uppercase text-white">
                                                {log.menu_item?.name || 'Deleted Item'}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold border ${style}`}>
                                                    {label}
                                                </span>
                                            </td>
                                            <td className={`p-4 font-black text-sm ${amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {amount > 0 ? `+${amount}` : amount}
                                            </td>
                                            <td className="p-4 text-xs text-zinc-500 italic">
                                                {log.reason || '—'}
                                            </td>
                                            <td className="p-4 text-xs text-zinc-400 uppercase font-mono">
                                                {log.user?.name || '—'}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryLogs;