
import { VlasovSolver } from '../physics/vlasovEngine';

/**
 * Phase 1.4 Master Reproduction Script (Headless)
 * Reproduces Figure 1 and Table 1 of the Phase 1 manuscript.
 * USAGE: Call runPhase1Benchmark() to generate scientific artifact.
 */
export async function runPhase1Benchmark(seed: number = 42) {
  // CONFIGURATION (Frozen for Phase 1)
  const k = 0.5;
  const alpha = 0.05; // Linear/Weakly nonlinear regime
  const solver = new VlasovSolver(k, alpha);
  const maxSteps = 1500;
  
  console.log(`[REPRODUCTION] Initializing with SEED: ${seed}`);
  console.log(`[REPRODUCTION] Regime: ${alpha < 0.1 ? 'VALID (Weakly Nonlinear)' : 'WARNING (Strong Trapping)'}`);

  const history: any[] = [];
  
  // Execution loop
  for (let i = 0; i < maxSteps; i++) {
    const step = solver.step();
    history.push(step);
    if (step.t > solver.T_FIT_END + 10) break;
  }

  // Regression utility for Damping Rate (Gamma)
  const getGamma = (key: string) => {
    const fitData = history.filter(h => h.t >= solver.T_FIT_START && h.t <= solver.T_FIT_END);
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
  const tRec = (2 * Math.PI * Math.sqrt(8)) / k;
  const recData = history.filter(h => Math.abs(h.t - tRec) < 2.0);
  const maxRecurrenceAmplitude = Math.max(...recData.map(d => d.eTruncated));
  const hybridAmplitudeAtTRec = Math.max(...recData.map(d => d.eHybrid));
  const suppressionRatio = maxRecurrenceAmplitude / hybridAmplitudeAtTRec;

  const report = {
    metadata: {
      project: "PlasmaMind-LD",
      version: "Phase-1.4-Final",
      seed: seed,
      timestamp: new Date().toISOString(),
      regime: alpha < 0.1 ? "Linear/Weakly-Nonlinear" : "Strongly-Nonlinear (Out of Bounds)"
    },
    metrics: {
      gamma_analytic: solver.GAMMA_THEORY,
      gamma_truth: parseFloat(gamma_truth.toFixed(6)),
      gamma_hybrid: parseFloat(gamma_hybrid.toFixed(6)),
      gamma_truncated: parseFloat(gamma_truncated.toFixed(6)),
      rel_error_hybrid: parseFloat((Math.abs(gamma_truth - gamma_hybrid) / Math.abs(gamma_truth)).toExponential(4)),
    },
    stability: {
      mass_conservation_residue: history[history.length - 1].massError.toExponential(4),
      recurrence_suppression_db: parseFloat((20 * Math.log10(suppressionRatio)).toFixed(2)),
      is_dissipative: history[history.length - 1].fieldEnergy < history[0].fieldEnergy
    },
    verification: {
      status: Math.abs(gamma_truth - gamma_hybrid) / Math.abs(gamma_truth) < 0.01 ? "PASSED" : "FAILED",
      falsification_observed: maxRecurrenceAmplitude > 2 * history.filter(h => h.t > 15)[0].eTruth
    }
  };

  return report;
}
