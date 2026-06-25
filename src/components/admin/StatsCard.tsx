import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: string;
    chartData?: { value: number }[];
}

const StatsCard = ({ title, value, icon: Icon, trend, color = "primary", chartData }: StatsCardProps) => {
    const colorClasses = {
        primary: "bg-primary/10 text-primary",
        green: "bg-green-500/10 text-green-600",
        blue: "bg-blue-500/10 text-blue-600",
        orange: "bg-orange-500/10 text-orange-600",
    };

    const chartColor = {
        primary: "hsl(var(--primary))",
        green: "#16a34a",
        blue: "#2563eb",
        orange: "#ea580c",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background rounded-xl border border-border p-6 hover:shadow-lg transition-all group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                    <h3 className="text-3xl font-display font-bold text-foreground tracking-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.primary}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            <div className="flex items-end justify-between gap-4">
                <div className="flex-1">
                    {trend && (
                        <div className={`flex items-center gap-1 text-xs font-semibold ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-current/10">
                                {trend.isPositive ? "↑" : "↓"}
                            </span>
                            {trend.isPositive ? "+" : ""}{trend.value}%
                            <span className="text-muted-foreground font-normal ml-1 text-[10px] uppercase tracking-wider">vs last month</span>
                        </div>
                    )}
                </div>

                {chartData && (
                    <div className="h-10 w-24">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={chartColor[color as keyof typeof chartColor] || chartColor.primary}
                                    fill={chartColor[color as keyof typeof chartColor] || chartColor.primary}
                                    fillOpacity={0.1}
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default StatsCard;
