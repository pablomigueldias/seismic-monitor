import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEarthquakes, syncEarthquakes } from './services/api';
import { SeismicMap } from './components/SeismicMap';
import { StatsGrid } from './components/StatsGrid';
import { RecentList } from './components/RecentList';
import { ChartsSection } from './components/ChartsSection';
import { Activity, RefreshCw, Filter, Loader2, Satellite } from 'lucide-react';
import { Toaster, toast } from 'sonner';

function App() {
  const [minMag, setMinMag] = useState(0);
  const queryClient = useQueryClient();

  const { data: earthquakes, isLoading, isError } = useQuery({
    queryKey: ['earthquakes'],
    queryFn: getEarthquakes,
    refetchInterval: 60000, 
  });

  const syncMutation = useMutation({
    mutationFn: syncEarthquakes,
    onMutate: () => {
      toast.loading("Conectando aos satélites USGS...", { id: 'sync-toast' });
    },
    onSuccess: (data) => {
      toast.success(`Sincronização concluída!`, {
        id: 'sync-toast',
        description: `${data.new} novos eventos detectados e ${data.updated} atualizados.`,
        duration: 4000,
        icon: <Satellite className="h-5 w-5 text-green-500" />
      });
      queryClient.invalidateQueries({ queryKey: ['earthquakes'] });
    },
    onError: () => {
      toast.error("Falha na sincronização", {
        id: 'sync-toast',
        description: "Não foi possível conectar à API da USGS. Tente novamente.",
      });
    }
  });

  const filteredData = earthquakes?.filter(eq => eq.magnitude >= minMag) || [];

  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500 animate-pulse font-mono">INICIALIZANDO SISTEMAS...</div>;
  
  if (isError) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-red-500 gap-4">
      <Activity className="h-16 w-16" />
      <h1 className="text-2xl font-bold">ERRO DE CONEXÃO</h1>
      <p className="text-slate-400">Verifique se o Backend (Porta 8000) está rodando.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      
      <Toaster position="top-right" theme="dark" richColors closeButton />

      <div className="max-w-[1600px] mx-auto space-y-6">
        
        <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
              <Activity className="text-blue-500 h-8 w-8" />
              Seismic<span className="text-blue-500">Monitor</span> 
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-mono">USGS FEED • v1.0.0</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
            <div className="bg-slate-900/50 p-1.5 rounded-xl border border-slate-800 flex items-center gap-4 w-full md:w-auto shadow-inner">
              <div className="flex items-center gap-2 text-slate-400 px-3">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Magnitude</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="8" 
                step="0.5" 
                value={minMag}
                onChange={(e) => setMinMag(parseFloat(e.target.value))}
                className="w-32 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
              />
              <span className="text-white font-mono font-bold w-10 text-right pr-2">{minMag.toFixed(1)}+</span>
            </div>

            <button 
              onClick={() => syncMutation.mutate()}
              disabled={syncMutation.isPending}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg w-full md:w-auto justify-center border
                ${syncMutation.isPending 
                  ? 'bg-slate-800 border-slate-700 cursor-not-allowed text-slate-400' 
                  : 'bg-blue-600 border-blue-500 hover:bg-blue-500 text-white hover:shadow-blue-500/20 active:scale-95'
                }`}
            >
              {syncMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AGUARDE...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  SYNC DATA
                </>
              )}
            </button>
          </div>
        </header>

        <StatsGrid data={filteredData} />

        <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative min-h-[500px] group">
            <div className="absolute top-4 right-4 z-[400] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-blue-400 border border-white/10 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              LIVE SATELLITE VIEW • {filteredData.length} EVENTOS
            </div>
            <SeismicMap data={filteredData} />
          </div>

          <div className="lg:col-span-1">
            <RecentList data={filteredData} />
          </div>

          <div className="lg:col-span-4">
             <ChartsSection data={filteredData} />
          </div>
        </main>

        <footer className="mt-12 py-8 border-t border-slate-800/50 text-center text-slate-600 text-sm font-medium">
          <p>© 2026 Global Seismic Monitor. Desenvolvido por <span className="text-slate-200">Pablo Ortiz</span>.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;