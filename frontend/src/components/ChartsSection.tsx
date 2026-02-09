import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
  BarChart, Bar
} from "recharts";
import type { Earthquake } from "../services/api";
import { BarChart3, PieChart } from "lucide-react";

interface ChartsSectionProps {
  data: Earthquake[];
}

export function ChartsSection({ data }: ChartsSectionProps) {
  const timelineData = [...data]
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
    .map(eq => ({
      time: new Date(eq.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      magnitude: eq.magnitude,
    }));

  const distributionData = [
    { name: 'Menor (0-4)', count: data.filter(e => e.magnitude < 4).length, color: '#4ade80' },
    { name: 'Moderado (4-6)', count: data.filter(e => e.magnitude >= 4 && e.magnitude < 6).length, color: '#facc15' },
    { name: 'Severo (>6)', count: data.filter(e => e.magnitude >= 6).length, color: '#ef4444' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      

      <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 shadow-xl backdrop-blur-sm">
        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
          <BarChart3 className="text-blue-400" />
          Sismograma (Tempo Real)
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorMag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 10 }} minTickGap={30} />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }} />
              <ReferenceLine y={5} stroke="red" strokeDasharray="3 3" label={{ position: 'top', value: 'Crítico', fill: 'red', fontSize: 10 }} />
              <Area type="monotone" dataKey="magnitude" stroke="#3b82f6" fill="url(#colorMag)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 shadow-xl backdrop-blur-sm">
        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
          <PieChart className="text-purple-400" />
          Distribuição de Severidade
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} tick={{fontSize: 12}} />
              <Tooltip cursor={{fill: '#334155'}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }} />

              <Bar 
                dataKey="count" 
                shape={(props: any) => {

                    const { x, y, width, height, payload } = props;
                    return (
                        <rect 
                            x={x} 
                            y={y} 
                            width={width} 
                            height={height} 
                            fill={payload.color} 
                            rx={4}
                            ry={4} 
                        />
                    );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}