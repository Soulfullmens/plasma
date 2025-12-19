
import React, { useState } from 'react';
import ResearchAssistant from './components/ResearchAssistant';
import SimulationPanel from './components/SimulationPanel';
import { ROADMAP_DATA, ICONS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'simulation' | 'roadmap' | 'dataset'>('simulation');

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">PlasmaMind-LD <span className="text-indigo-500 text-xs ml-1 font-mono uppercase">Phase 1</span></h1>
            <p className="text-[10px] text-slate-500 font-mono -mt-1 uppercase tracking-tighter">Technical Feasibility Assessment</p>
          </div>
        </div>
        <nav className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
          <button 
            onClick={() => setActiveTab('simulation')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${activeTab === 'simulation' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <ICONS.Chart /> Validation
          </button>
          <button 
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${activeTab === 'roadmap' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <ICONS.Terminal /> Methodology
          </button>
        </nav>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
             <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             EXECUTION_READY
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all cursor-help" title="TRL-3 Scientist">
            <img src="https://picsum.photos/seed/physicist/32/32" alt="Avatar" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Left Column: Dashboard/Roadmap */}
        <div className="flex-[3] flex flex-col min-w-0">
          {activeTab === 'simulation' && (
            <div className="h-full flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Scientific Benchmark", value: "TRL-3", sub: "Feasibility Evaluation", color: "indigo" },
                  { label: "Closure Fidelity", value: "γ-RECOVERY", sub: "Within 10⁻³ L2 Threshold", color: "emerald" },
                  { label: "Ablation Status", value: "ACTIVE", sub: "Falsification Testing", color: "amber" }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl shadow-sm">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
                      <span className="text-[10px] text-slate-400 font-mono uppercase">{stat.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex-1 min-h-0">
                <SimulationPanel />
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="h-full bg-slate-900/50 border border-slate-800 rounded-xl p-8 overflow-y-auto">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold mb-4">Verification Methodology</h2>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  The Phase 1 protocol anchors results in the falsification of the M=8 truncated model. By demonstrating that the Hybrid MLP recovers ground-truth damping rates without injecting energy (W_E stability), we provide evidence for the kinetic cascade hypothesis. All benchmarks are compared against a M=128 surrogate Truth solver.
                </p>
                
                <div className="space-y-8">
                  {Array.from(new Set(ROADMAP_DATA.map(d => d.phase))).map(phase => (
                    <div key={phase}>
                      <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] mb-4 border-b border-indigo-500/20 pb-2">{phase}</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {ROADMAP_DATA.filter(d => d.phase === phase).map(step => (
                          <div key={step.id} className="flex gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/40 hover:bg-slate-900/60 transition-colors">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                              step.status === 'completed' || step.id === '1.4.1' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-600'
                            }`}>
                              {(step.status === 'completed' || step.id === '1.4.1') ? <ICONS.Check /> : <span className="text-[9px] font-bold">{step.id.split('.').pop()}</span>}
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-semibold text-slate-300 text-xs tracking-tight">{step.title}</h4>
                                <span className="text-[8px] px-1.5 py-0.5 rounded-full uppercase font-mono bg-slate-950 text-slate-500 border border-slate-800">
                                  {step.id === '1.4.1' ? 'Verified' : step.status}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 leading-snug italic">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Assistant */}
        <div className="flex-1 flex flex-col min-w-[320px] max-w-[450px]">
          <ResearchAssistant />
        </div>
      </main>

      {/* Footer */}
      <footer className="h-10 border-t border-slate-800 flex items-center justify-between px-6 bg-slate-950 text-[10px] text-slate-500 font-mono tracking-widest uppercase">
        <div className="flex gap-6">
          <span>PROJECT: PLASMAMIND-LD</span>
          <span>STATUS: P1_LOCKED</span>
          <span>TRL: 3_ASSESSED</span>
        </div>
        <div>
          © 2024 PHYSICS AI RESEARCH LAB • NULLIUS IN VERBA
        </div>
      </footer>
    </div>
  );
};

export default App;
