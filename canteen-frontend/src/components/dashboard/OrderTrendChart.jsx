import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OrderTrendChart = ({ data = [] }) => {
    return (
        <div className="bg-zinc-950 border border-zinc-900 rounded-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-white">Order Trends</h3>
                    <p className="text-[10px] text-zinc-600 mt-0.5">Past 30 days</p>
                </div>
                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded-sm font-bold uppercase tracking-wider">
                    Orders
                </span>
            </div>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid stroke="#1a1a1a" strokeDasharray="3 3" />
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
                            width={30}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#18181b',
                                border: '1px solid #3f3f46',
                                borderRadius: '4px',
                                fontSize: '11px'
                            }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="orders"
                            stroke="#dc2626"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, fill: '#dc2626' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default OrderTrendChart;