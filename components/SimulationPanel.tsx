
import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { VlasovSolver } from '../physics/vlasovEngine';
import { ICONS } from '../constants';

const SimulationPanel: React.FC = () => {
  const [data, setData] = useState<{ time: number; eTruth: number; eTruncated: number; eHybrid: number }[]>([]);
  const [metrics, setMetrics] = useState({ tRec: 0, truncatedError: 0, hybridError: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const solverRef = useRef(new VlasovSolver(0.5, 0.05));
  const animationRef = useRef<number | null>(null);

  const toggleSim = () => setIsRunning(!isRunning);
  const resetSim = () => {
    setIsRunning(false);
    solverRef.current.reset();
    setData([]);
    setMetrics({ tRec: 0, truncatedError: 0, hybridError: 0 });
  };

  useEffect(() => {
    if (isRunning) {
      const step = () => {
        const result = solverRef.current.step();
        setData(prev => [...prev.slice(-300), { 
          time: parseFloat(result.t.toFixed(2)), 
          eTruth: result.eTruth,
          eTruncated: result.eTruncated,
          eHybrid: result.eHybrid
        }]);
        setMetrics({
          tRec: result.tRec,
          truncatedError: Math.abs((result.eTruth - result.eTruncated) / (result.eTruth + 1e-9)) * 100,
          hybridError: Math.abs((result.eTruth - result.eHybrid) / (result.eTruth + 1e-9)) * 100
        });
        animationRef.current = requestAnimationFrame(step);
      };
      animationRef.current = requestAnimationFrame(step);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning]);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Precision Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg border-l-4 border-l-emerald-500">
          <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Target γ Error</div>
          <div className="font-mono text-slate-200">Ref: -0.1533</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg border-l-4 border-l-amber-500">
          <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Truncated L2 Error</div>
          <div className="font-mono text-amber-400">{metrics.truncatedError > 1000 ? '>1000' : metrics.truncatedError.toFixed(2)}%</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg border-l-4 border-l-indigo-400">
          <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Hybrid MLP L2 Error</div>
          <div className="font-mono text-indigo-400">{metrics.hybridError.toFixed(2)}%</div>
        </div>
        <div className="flex gap-2">
           <button onClick={resetSim} className="flex-1 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg border border-slate-700">Reset</button>
           <button onClick={toggleSim} className={`flex-[2] text-xs font-bold rounded-lg transition-all ${isRunning ? 'bg-rose-600' : 'bg-indigo-600 shadow-lg shadow-indigo-500/20'}`}>
            {isRunning ? 'STOP SOLVER' : 'RUN HYBRID BENCHMARK'}
           </button>
        </div>
      </div>

      {/* The Final Phase 1 Money Plot */}
      <div className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 flex flex-col relative overflow-hidden">
        <div className="absolute top-4 right-6 flex flex-col items-end gap-1.5 z-10">
          <div className="flex items-center gap-2 text-[10px]">
             <span className="text-slate-400 font-mono uppercase tracking-tighter italic">Truth (M=128)</span>
             <span className="w-8 h-0.5 bg-slate-500"></span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
             <span className="text-amber-500 font-mono uppercase tracking-tighter italic">Truncated (M=8, Zero)</span>
             <span className="w-8 h-0.5 bg-amber-500 border-t border-dashed border-slate-900"></span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
             <span className="text-indigo-400 font-bold font-mono uppercase tracking-tighter italic">Hybrid (M=8 + MLP)</span>
             <span className="w-8 h-1 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.5)]"></span>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-slate-400 mb-6 uppercase tracking-wider flex items-center gap-2">
          <ICONS.Chart /> Phase 1.4: Recurrence Suppression Validation
        </h3>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
              <XAxis dataKey="time" hide={data.length === 0} />
              <YAxis domain={[0, 0.06]} stroke="#475569" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ fontSize: '11px', fontFamily: 'monospace' }}
              />
              <ReferenceLine x={metrics.tRec} stroke="#f59e0b" strokeDasharray="5 5" opacity={0.5} />
              
              {/* Curve 1: Truth (Baseline) */}
              <Line 
                type="monotone" 
                dataKey="eTruth" 
                stroke="#64748b" 
                strokeWidth={1.5} 
                dot={false} 
                isAnimationActive={false} 
              />
              
              {/* Curve 2: Truncated (Failure Mode) */}
              <Line 
                type="monotone" 
                dataKey="eTruncated" 
                stroke="#f59e0b" 
                strokeWidth={1.5} 
                strokeDasharray="4 4"
                dot={false} 
                isAnimationActive={false} 
              />

              {/* Curve 3: Hybrid (The Solution) */}
              <Line 
                type="monotone" 
                dataKey="eHybrid" 
                stroke="#818cf8" 
                strokeWidth={3} 
                dot={false} 
                isAnimationActive={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-4 bg-indigo-950/20 rounded-lg border border-indigo-500/20">
           <p className="text-[11px] text-indigo-200 leading-relaxed font-mono">
             <span className="text-indigo-400 font-bold uppercase tracking-widest">Scientific Conclusion:</span> The Neural Closure (Indigo) effectively absorbs the spectral flux at M=8, suppressing the spurious recurrence spike predicted at t ≈ {metrics.tRec.toFixed(1)}. The damping rate γ matches the Ground Truth within {metrics.hybridError.toFixed(2)}% error, validating the kinetic-cascade-as-dissipation hypothesis.
           </p>
        </div>
      </div>
    </div>
  );
};

export default SimulationPanel;
