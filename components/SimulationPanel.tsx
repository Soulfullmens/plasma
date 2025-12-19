
import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts';
import { VlasovSolver } from '../physics/vlasovEngine';
import { ICONS } from '../constants';

const SimulationPanel: React.FC = () => {
  const [data, setData] = useState<{ time: number; eTruth: number; eTruncated: number }[]>([]);
  const [metrics, setMetrics] = useState({ tRec: 0, gammaError: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const solverRef = useRef(new VlasovSolver(0.5, 0.05));
  const animationRef = useRef<number | null>(null);

  const toggleSim = () => setIsRunning(!isRunning);
  const resetSim = () => {
    setIsRunning(false);
    solverRef.current.reset();
    setData([]);
  };

  useEffect(() => {
    if (isRunning) {
      const step = () => {
        const result = solverRef.current.step();
        setData(prev => [...prev.slice(-200), { 
          time: parseFloat(result.t.toFixed(2)), 
          eTruth: result.eTruth,
          eTruncated: result.eTruncated 
        }]);
        setMetrics({
          tRec: result.tRec,
          gammaError: Math.abs((result.eTruth - result.eTruncated) / (result.eTruth + 1e-9)) * 100
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
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
          <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Theoretical γ</div>
          <div className="font-mono text-emerald-400">-0.1533</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
          <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Recurrence Time (T_rec)</div>
          <div className="font-mono text-amber-400">{metrics.tRec.toFixed(2)} ω_pe⁻¹</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
          <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Closure L2 Error</div>
          <div className="font-mono text-rose-400">{metrics.gammaError.toFixed(2)}%</div>
        </div>
        <div className="flex gap-2">
           <button onClick={resetSim} className="flex-1 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg border border-slate-700">Reset</button>
           <button onClick={toggleSim} className={`flex-[2] text-xs font-bold rounded-lg transition-all ${isRunning ? 'bg-rose-600' : 'bg-emerald-600'}`}>
            {isRunning ? 'STOP' : 'RUN BENCHMARK'}
           </button>
        </div>
      </div>

      {/* The Money Plot */}
      <div className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 flex flex-col relative overflow-hidden">
        <div className="absolute top-4 right-6 flex flex-col items-end gap-1 z-10">
          <div className="flex items-center gap-2 text-[10px]">
            <span className="w-3 h-0.5 bg-indigo-500"></span>
            <span className="text-slate-300 font-mono uppercase tracking-tighter italic">Truth (M=128 Surrogate)</span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="w-3 h-0.5 bg-amber-500"></span>
            <span className="text-slate-300 font-mono uppercase tracking-tighter italic">Truncated (M=8, Zero Closure)</span>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-slate-400 mb-6 uppercase tracking-wider flex items-center gap-2">
          <ICONS.Chart /> Linear Landau Damping & Recurrence Comparison
        </h3>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" label={{ value: 'Time (ω_pe⁻¹)', position: 'insideBottomRight', offset: -5, fill: '#64748b', fontSize: 10 }} hide={data.length === 0} />
              <YAxis domain={[0, 0.06]} stroke="#64748b" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ fontSize: '11px', fontFamily: 'monospace' }}
              />
              <ReferenceLine x={metrics.tRec} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'Recurrence Threshold', position: 'top', fill: '#f59e0b', fontSize: 10 }} />
              <Line 
                type="monotone" 
                dataKey="eTruth" 
                stroke="#6366f1" 
                strokeWidth={3} 
                dot={false} 
                isAnimationActive={false} 
              />
              <Line 
                type="monotone" 
                dataKey="eTruncated" 
                stroke="#f59e0b" 
                strokeWidth={2} 
                strokeDasharray="3 3"
                dot={false} 
                isAnimationActive={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-4 bg-slate-950/50 rounded-lg border border-slate-800">
           <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
             <span className="text-indigo-400 font-bold">LOG:</span> Simulation initialized at k=0.5. 
             Observed recurrence spike at t ≈ {metrics.tRec.toFixed(1)}. 
             Validation objective: The Neural Closure must suppress the Amber (dashed) rebound to match the Indigo (solid) trajectory.
           </p>
        </div>
      </div>
    </div>
  );
};

export default SimulationPanel;
