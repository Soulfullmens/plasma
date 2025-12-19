
import React from 'react';

export const ROADMAP_DATA = [
  // Phase 1: LOCKED
  { id: '1.1.1', phase: 'Phase 1: Electrostatic', title: 'Basis Implementation', status: 'completed', description: 'Recursive generation of Hermite basis functions and interaction matrices.' },
  { id: '1.1.2', phase: 'Phase 1: Electrostatic', title: 'RK4 Solver Construction', status: 'completed', description: 'Explicit RK4 time-stepper using Method of Lines.' },
  { id: '1.1.3', phase: 'Phase 1: Electrostatic', title: 'Linear Landau Validation', status: 'completed', description: 'Benchmarking gamma against analytic dispersion relation.' },
  { id: '1.4.1', phase: 'Phase 1: Electrostatic', title: 'Hybrid Online Integration', status: 'completed', description: 'Replacing truncation with neural closure in RK4 loop.' },
  
  // Phase 2: ACTIVE
  { id: '2.1.1', phase: 'Phase 2: EM Scaling', title: 'EM Interaction Tensors', status: 'in-progress', description: 'Deriving the coupling between longitudinal and transverse Hermite moments.' },
  { id: '2.2.1', phase: 'Phase 2: EM Scaling', title: 'Transverse Wave Solver', status: 'pending', description: 'Integrating Maxwell equations into the spectral hierarchy.' },
  { id: '2.3.1', phase: 'Phase 2: EM Scaling', title: 'Multi-GPU JAX Scaling', status: 'pending', description: 'Porting the closure MLP to distributed vmap for 3D-3V scaling.' }
];

export const ICONS = {
  Play: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Brain: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Chart: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Terminal: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
};
