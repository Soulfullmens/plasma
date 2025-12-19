
import { KrehmSolver } from '../physics/krehmEngine';
import { phase2Config } from './config/phase2';

/**
 * Phase 2 Quantitative Validation Script
 * Measures Energy Conservation and Damping Accuracy
 */
export async function runPhase2Validation() {
  const solver = new KrehmSolver();
  const history: any[] = [];
  const maxSteps = 2000;

  console.log("Starting Phase 2 Quantitative Validation...");

  for (let i = 0; i < maxSteps; i++) {
    const step = solver.step();
    history.push({
      time: step.t,
      aHybrid: step.aHybrid,
      aTruth: step.aTruth,
      // Fix: solver.step() returns hHybrid and hTruth, not energy.total/energyRef.total
      energy: step.hHybrid,
      energyRef: step.hTruth
    });
    if (step.t > 60) break;
  }

  const getGamma = (key: string) => {
    const fit = history.filter(h => h.time >= 10 && h.time <= 40);
    const x = fit.map(d => d.time);
    // Fix: Use Math.abs(d[key]) to handle oscillating field signals when calculating damping rates
    const y = fit.map(d => Math.log(Math.abs(d[key]) + 1e-12));
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumXX = x.reduce((a, b) => a + b * b, 0);
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  };

  const gammaTruth = getGamma('aTruth');
  const gammaHybrid = getGamma('aHybrid');
  const energyDrift = (history[history.length - 1].energy - history[0].energyRef) / history[0].energyRef;

  console.table({
    "Metric": ["Gamma (Truth)", "Gamma (Hybrid)", "Energy Drift (ΔH)", "Status"],
    "Value": [
      gammaTruth.toFixed(6),
      gammaHybrid.toFixed(6),
      energyDrift.toExponential(4),
      Math.abs(energyDrift) < 0.05 ? "ADMISSIBLE" : "FAILED"
    ]
  });

  return { gammaTruth, gammaHybrid, energyDrift };
}
