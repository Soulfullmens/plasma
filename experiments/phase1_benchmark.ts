
import { VlasovSolver } from '../physics/vlasovEngine';

/**
 * Phase 1.4 Headless Benchmark Script
 * Reproduces the primary falsification experiment without UI dependencies.
 * Run this to generate the terminal-ready scientific report.
 */
export async function runPhase1Benchmark() {
  const k = 0.5;
  const alpha = 0.05;
  const solver = new VlasovSolver(k, alpha);
  const maxSteps = 1500;
  
  console.log(`[BENCHMARK] Starting Phase 1 Verification (k=${k}, alpha=${alpha})`);
  console.log(`[BENCHMARK] Fitting Window: [${solver.T_FIT_START}, ${solver.T_FIT_END}]`);

  const history: any[] = [];
  
  for (let i = 0; i < maxSteps; i++) {
    const step = solver.step();
    history.push(step);
    if (step.t > solver.T_FIT_END + 10) break;
  }

  // Calculate Gamma via log-linear regression in the fit window
  const fitData = history.filter(h => h.t >= solver.T_FIT_START && h.t <= solver.T_FIT_END);
  
  const getGamma = (key: string) => {
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

  const relError = Math.abs((gamma_truth - gamma_hybrid) / gamma_truth);
  
  const report = {
    gamma_theory: solver.GAMMA_THEORY,
    gamma_truth: parseFloat(gamma_truth.toFixed(6)),
    gamma_hybrid: parseFloat(gamma_hybrid.toFixed(6)),
    gamma_truncated: parseFloat(gamma_truncated.toFixed(6)),
    relative_error: parseFloat(relError.toExponential(4)),
    status: relError < 0.01 ? "VERIFIED" : "FAILED",
    timestamp: new Date().toISOString()
  };

  return report;
}
