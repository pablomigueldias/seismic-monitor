import type { Earthquake } from "../services/api";
import { AlertTriangle } from "lucide-react";

interface RecentListProps {
  data: Earthquake[];
}

export function RecentList({ data }: RecentListProps) {
  const sorted = [...data].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 border-b border-slate-700 bg-slate-800">
        <h2 className="font-bold text-white flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          Feed em Tempo Real
        </h2>
      </div>
      
      <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
        {sorted.map((eq) => (
          <div key={eq.id} className="p-3 hover:bg-slate-700/50 rounded-lg transition-colors border border-transparent hover:border-slate-600 group">
            <div className="flex justify-between items-start">
              <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                eq.magnitude >= 5 ? 'bg-red-500/20 text-red-400' : 
                eq.magnitude >= 3 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
              }`}>
                M {eq.magnitude.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500 group-hover:text-slate-300">
                {new Date(eq.time).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
              </span>
            </div>
            <p className="text-slate-300 text-sm mt-1 truncate font-medium" title={eq.place}>
              {eq.place}
            </p>
            <p className="text-xs text-slate-500 mt-1">Prof: {eq.depth}km</p>
          </div>
        ))}
      </div>
    </div>
  );
}