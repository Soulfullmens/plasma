
import React, { useState } from 'react';
import ResearchAssistant from './components/ResearchAssistant';
import SimulationPanel from './components/SimulationPanel';
import { ROADMAP_DATA, ICONS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'simulation' | 'roadmap' | 'dataset'>('simulation');

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-fuchsia-500/30">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-fuchsia-600 rounded-lg flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
            <span className="font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">PlasmaMind-LD <span className="text-fuchsia-500 text-xs ml-1 font-mono uppercase">Phase 2</span></h1>
            <p className="text-[10px] text-slate-500 font-mono -mt-1 uppercase tracking-tighter">EM Scaling & Transverse Coupling</p>
          </div>
        </div>
        <nav className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
          <button 
            onClick={() => setActiveTab('simulation')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${activeTab === 'simulation' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <ICONS.Chart /> Validation
          </button>
          <button 
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${activeTab === 'roadmap' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <ICONS.Terminal /> Roadmap
          </button>
        </nav>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] text-fuchsia-400 font-mono font-bold">
             <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse shadow-[0_0_8px_rgba(217,70,239,0.8)]"></span>
             PHASE_2_ACTIVE
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all cursor-help" title="Phase 2 Commenced">
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
                  { label: "Status", value: "TRL-2", sub: "Scaling Design", color: "fuchsia" },
                  { label: "EM Coupling", value: "B-FIELD", sub: "Transverse Tensors", color: "violet" },
                  { label: "Validation", value: "LOCKED", sub: "Phase 1 Frozen", color: "slate" }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl shadow-sm">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-2xl font-bold tracking-tight text-${stat.color}-400`}>{stat.value}</span>
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
                <h2 className="text-2xl font-bold mb-4">PlasmaMind-LD: Execution Roadmap</h2>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed italic">
                  Phase 1 is now a historical artifact. Phase 2 introduces electromagnetic scaling. We are moving from the 1D-1V Electrostatic Vlasov-Poisson to the transverse electromagnetic regime.
                </p>
                
                <div className="space-y-8">
                  {Array.from(new Set(ROADMAP_DATA.map(d => d.phase))).map(phase => (
                    <div key={phase}>
                      <h3 className={`text-[10px] font-bold ${phase.includes('Phase 1') ? 'text-slate-500' : 'text-fuchsia-400'} uppercase tracking-[0.3em] mb-4 border-b border-fuchsia-500/20 pb-2`}>{phase}</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {ROADMAP_DATA.filter(d => d.phase === phase).map(step => (
                          <div key={step.id} className={`flex gap-4 p-4 rounded-xl border ${step.status === 'completed' ? 'bg-slate-900/20 border-slate-800/20 opacity-60' : 'bg-slate-900/40 border-slate-800/40'}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${step.status === 'completed' ? 'bg-slate-500/10 text-slate-500' : 'bg-fuchsia-500/10 text-fuchsia-500'}`}>
                              {step.status === 'completed' ? <ICONS.Check /> : (step.status === 'in-progress' ? <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-ping" /> : <div className="w-2 h-2 rounded-full border border-slate-600" />)}
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className={`font-semibold text-xs tracking-tight ${step.status === 'completed' ? 'text-slate-500' : 'text-slate-300'}`}>{step.title}</h4>
                                <span className={`text-[8px] px-1.5 py-0.5 rounded-full uppercase font-mono border ${
                                  step.status === 'completed' ? 'bg-slate-950 text-slate-500 border-slate-800' : 
                                  step.status === 'in-progress' ? 'bg-fuchsia-950 text-fuchsia-500 border-fuchsia-900' : 
                                  'bg-slate-950 text-slate-600 border-slate-800'
                                }`}>
                                  {step.status}
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
          <span className="text-fuchsia-500 font-bold">MODE: PHASE2_ACTIVE</span>
          <span>MD5: 8F7E...A2B</span>
        </div>
        <div>
          © 2024 PHYSICS AI RESEARCH LAB • NULLIUS IN VERBA
        </div>
      </footer>
    </div>
  );
};

export default App;
