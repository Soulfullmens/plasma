
import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { VlasovSolver } from '../physics/vlasovEngine';
import { ICONS } from '../constants';

const SimulationPanel: React.FC = () => {
  const [data, setData] = useState<{ time: number; eField: number }[]>([]);
  const [moments, setMoments] = useState<{ name: string; value: number }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const solverRef = useRef(new VlasovSolver(16, 0.5, 0.05));
  const animationRef = useRef<number | null>(null);

  const toggleSim = () => {
    setIsRunning(!isRunning);
  };

  const resetSim = () => {
    setIsRunning(false);
    solverRef.current.reset();
    setData([]);
    setMoments([]);
  };

  useEffect(() => {
    if (isRunning) {
      const step = () => {
        const result = solverRef.current.step();
        setData(prev => [...prev.slice(-100), { time: parseFloat(result.t.toFixed(2)), eField: result.eField }]);
        setMoments(result.moments.map((v, i) => ({ name: `m${i}`, value: Math.abs(v) })));
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
      <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm font-semibold text-slate-200">System: 1D Vlasov-Poisson (Hermite-Spectral)</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-700"></div>
          <div className="text-xs text-slate-400 font-mono">M=16, k=0.5, Δt=0.05, RK4</div>
        </div>
        <div className="flex gap-2">
          <button onClick={resetSim} className="p-2 hover:bg-slate-800 text-slate-400 transition-colors rounded-lg border border-slate-700">
            Reset
          </button>
          <button 
            onClick={toggleSim} 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all shadow-lg ${
              isRunning ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isRunning ? 'Pause Engine' : 'Start Engine'}
            <ICONS.Play />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Electric Field Decay | ln|E(t)|</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 0.06]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="eField" stroke="#6366f1" fill="url(#colorE)" fillOpacity={0.3} isAnimationActive={false} />
                <defs>
                  <linearGradient id="colorE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Hermite Moment Hierarchy | m=0...16</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moments}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} scale="log" domain={['auto', 'auto']} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                />
                <Line type="stepAfter" dataKey="value" stroke="#10b981" strokeWidth={2} dot={true} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationPanel;
