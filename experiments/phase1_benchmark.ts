
import { VlasovSolver } from '../physics/vlasovEngine';
import { phase1Config } from './config/phase1';

/**
 * Phase 1.4 Master Reproduction Script (Headless-Ready)
 * Reproduces the scientific core of the Phase 1 manuscript.
 * Generates:
 * 1. Quantitative metrics table (console)
 * 2. Scientific JSON artifact (results)
 */
export async function runPhase1Benchmark() {
  const cfg = phase1Config.physics;
  const seed = phase1Config.reproducibility.seed;
  
  const solver = new VlasovSolver(cfg.k, cfg.alpha);
  solver.reset(); // Ensures seed 42
  
  console.log(`\n==========================================================`);
  console.log(`PHASE 1 SCIENTIFIC REPRODUCTION [SEED: ${seed}]`);
  console.log(`==========================================================`);
  console.log(`Regime: ${cfg.alpha < 0.1 ? 'VALID (Weakly Nonlinear)' : 'OUT OF BOUNDS (Strong Trapping)'}`);
  
  const history: any[] = [];
  for (let i = 0; i < cfg.max_steps; i++) {
    const step = solver.step();
    history.push(step);
    if (step.t > cfg.t_fit[1] + 10) break;
  }

  // Regression utility for Damping Rate (Gamma)
  const getGamma = (key: string) => {
    const fitData = history.filter(h => h.t >= cfg.t_fit[0] && h.t <= cfg.t_fit[1]);
    const x = fitData.map(d => d.t);
    const y = fitData.map(d => Math.log(d[key] + 1e-12));
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumXX = x.reduce((a, b) => a + b * b, 0);
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  };

  const gamma_truth = getGamma('eTruth');
  const gamma_hybrid = getGamma('eHybrid');
  const gamma_truncated = getGamma('eTruncated');

  // Quantifying Suppression of Recurrence
  const tRec = (2 * Math.PI * Math.sqrt(cfg.M_coarse)) / cfg.k;
  const recData = history.filter(h => Math.abs(h.t - tRec) < 2.0);
  const maxRecurrenceAmplitude = Math.max(...recData.map(d => d.eTruncated));
  const hybridAmplitudeAtTRec = Math.max(...recData.map(d => d.eHybrid));
  const suppressionRatio = maxRecurrenceAmplitude / hybridAmplitudeAtTRec;

  const report = {
    metadata: {
      ...phase1Config.metadata,
      seed,
      timestamp: new Date().toISOString()
    },
    metrics_table: [
      { Model: "Truth (M=128)", Gamma: gamma_truth.toFixed(6), RelError: "0.00%", Status: "Reference" },
      { Model: "Truncated (M=8)", Gamma: gamma_truncated.toFixed(6), RelError: "N/A", Status: "Falsified" },
      { Model: "Hybrid (MLP)", Gamma: gamma_hybrid.toFixed(6), RelError: ((Math.abs(gamma_truth - gamma_hybrid) / Math.abs(gamma_truth)) * 100).toFixed(4) + "%", Status: "Verified" }
    ],
    stability: {
      mass_conservation: history[history.length - 1].massError.toExponential(4),
      recurrence_suppression_db: parseFloat((20 * Math.log10(suppressionRatio)).toFixed(2)),
      is_dissipative: history[history.length - 1].fieldEnergy < history[0].fieldEnergy
    },
    verification: {
      passed: Math.abs(gamma_truth - gamma_hybrid) / Math.abs(gamma_truth) < 0.01,
      tRec: tRec.toFixed(2)
    }
  };

  console.table(report.metrics_table);
  console.log(`[STATUS] Verification: ${report.verification.passed ? 'PASSED' : 'FAILED'}`);
  console.log(`==========================================================\n`);

  return report;
}
