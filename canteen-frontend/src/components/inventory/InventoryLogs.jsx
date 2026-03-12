import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InventoryLogs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://127.0.0.1:8000/api/inventory/logs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(res.data);
        };
        fetchLogs();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <h1 className="text-3xl font-black uppercase tracking-widest border-b-4 border-red-600 inline-block mb-8">
                Audit <span className="text-red-600">Trail</span>
            </h1>

            <div className="overflow-x-auto border border-zinc-800">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-900 text-red-500 uppercase text-xs tracking-widest border-b border-zinc-800">
                            <th className="p-4">Timestamp</th>
                            <th className="p-4">Item</th>
                            <th className="p-4">Action</th>
                            <th className="p-4">Qty Change</th>
                            <th className="p-4">Performed By</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-mono">
                        {logs.map((log) => (
                            <tr key={log.id} className="border-b border-zinc-900 hover:bg-zinc-950 transition">
                                <td className="p-4 text-zinc-500">{new Date(log.created_at).toLocaleString()}</td>
                                <td className="p-4 font-bold uppercase">{log.menu_item?.name || 'Deleted Item'}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                                        log.action === 'addition' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                                    }`}>
                                        {log.action.toUpperCase()}
                                    </span>
                                </td>
                                <td className={`p-4 font-bold ${log.quantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {log.quantity > 0 ? `+${log.quantity}` : log.quantity}
                                </td>
                                <td className="p-4 text-zinc-400 uppercase">{log.user?.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryLogs;