import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'Sarees', value: 400 },
    { name: 'Lehengas', value: 300 },
    { name: 'Kurtas', value: 300 },
    { name: 'Suits', value: 200 },
];

const COLORS = [
    'hsl(var(--primary))',
    '#3b82f6', // blue-500
    '#10b981', // emerald-500
    '#f59e0b'  // amber-500
];

const CategoryChart = () => {
    return (
        <div className="h-full min-h-[350px] w-full bg-[#1a1d23] rounded-2xl border border-white/5 p-8 shadow-xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-display font-bold text-white flex items-center gap-3">
                    Stock by Category
                </h3>
            </div>

            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    className="hover:opacity-80 transition-opacity cursor-pointer"
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1a1d23',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                color: '#fff'
                            }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            content={({ payload }) => (
                                <div className="flex justify-center gap-6 mt-4">
                                    {payload?.map((entry: { color: string; value: string }, index: number) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: entry.color }}
                                            />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                {entry.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />
        </div>
    );
};

export default CategoryChart;

