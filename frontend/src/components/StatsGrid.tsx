import type { Earthquake } from "../services/api";
import { Activity, BarChart3, Globe, Zap } from "lucide-react";

interface StatsGridProps {
  data: Earthquake[];
}

export function StatsGrid({ data }: StatsGridProps) {
  const total = data.length;
  const maxMag = data.reduce((max, eq) => (eq.magnitude > max ? eq.magnitude : max), 0);
  const avgDepth = (data.reduce((sum, eq) => sum + eq.depth, 0) / (total || 1)).toFixed(1);
  const significant = data.filter(eq => eq.magnitude > 5).length;

  const stats = [
    { label: "Total (1h)", value: total, icon: Globe, color: "text-blue-400" },
    { label: "Maior Magnitude", value: maxMag.toFixed(1), icon: Zap, color: "text-red-500" },
    { label: "Profundidade Média", value: `${avgDepth} km`, icon: Activity, color: "text-emerald-400" },
    { label: "Críticos (>5.0)", value: significant, icon: BarChart3, color: "text-orange-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
            <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
          </div>
        </div>
      ))}
    </div>
  );
}