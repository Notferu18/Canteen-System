import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-xs">
                <p className="text-zinc-400 mb-1">{label}</p>
                <p className="text-white font-bold">₱{payload[0].value?.toLocaleString()}</p>
            </div>
        );
    }
    return null;
};

const SalesChart = ({ data = [] }) => {
    return (
        <div className="bg-zinc-950 border border-zinc-900 rounded-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-white">Daily Revenue</h3>
                    <p className="text-[10px] text-zinc-600 mt-0.5">Past 7 days</p>
                </div>
                <span className="text-[10px] bg-red-600/10 text-red-500 px-2 py-1 rounded-sm font-bold uppercase tracking-wider">
                    Revenue
                </span>
            </div>
            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barSize={24}>
                        <XAxis
                            dataKey="day"
                            stroke="#3f3f46"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#3f3f46"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            width={50}
                            tickFormatter={v => `₱${v}`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                        <Bar dataKey="amount" fill="#dc2626" radius={[3, 3, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SalesChart;