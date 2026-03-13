import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#ef4444'];

const CategoryPieChart = ({ data = [] }) => {
    return (
        <div className="bg-zinc-950 border border-zinc-900 rounded-sm p-6">
            <div className="mb-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-white">By Category</h3>
                <p className="text-[10px] text-zinc-600 mt-0.5">Sales distribution</p>
            </div>

            <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={45}
                            outerRadius={65}
                            dataKey="value"
                            paddingAngle={3}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    stroke="none"
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#18181b',
                                border: '1px solid #3f3f46',
                                borderRadius: '4px',
                                fontSize: '11px'
                            }}
                            itemStyle={{ color: '#fff' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-2">
                {data.slice(0, 5).map((entry, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-[10px] text-zinc-400 uppercase tracking-wide truncate max-w-[100px]">
                                {entry.name}
                            </span>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-300">{entry.value}</span>
                    </div>
                ))}
                {data.length === 0 && (
                    <p className="text-zinc-700 text-xs text-center py-4">No data available</p>
                )}
            </div>
        </div>
    );
};

export default CategoryPieChart;