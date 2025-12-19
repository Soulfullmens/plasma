
import { phase2Config } from '../experiments/config/phase2';

/**
 * Phase 2: KREHM-Lite High-Fidelity Truth Solver
 * Scope: 1D-1V + Transverse Vector Potential (A_parallel)
 * Status: TASK 2.1.1 COMPLETED | TASK 2.2.1 IN-PROGRESS
 */

export class KrehmSolver {
  private M: number = 64; // High-M Truth for Phase 2 baseline
  private k: number = phase2Config.physics.k;
  private beta: number = phase2Config.physics.beta;
  private dt: number = phase2Config.physics.dt;
  
  public time: number = 0;
  private state: number[]; // [f0...fM, A_parallel, dA/dt]
  
  constructor() {
    // Initial state: Density perturbation + A_parallel seed
    // We add 2 extra slots for A and its derivative (inductive lag)
    this.state = new Array(this.M + 3).fill(0);
    this.state[0] = phase2Config.physics.alpha; 
    this.state[this.M + 1] = 0.005; // Initial A_parallel seed
  }

  private get induction() { return phase2Config.physics.induction_strength; }

  private computeRHS(state: number[]): number[] {
    const rhs = new Array(state.length).fill(0);
    const M = this.M;
    const f = state.slice(0, M + 1);
    const A = state[M + 1]; 
    const dAdt = state[M + 2];

    // 1. Vlasov Moments (Electrostatic core)
    for (let m = 0; m <= M; m++) {
      let termNext = (m < M) ? -this.k * Math.sqrt((m + 1) / 2) * f[m + 1] : 0;
      let termPrev = (m > 0) ? -this.k * Math.sqrt(m / 2) * f[m - 1] : 0;
      
      // Phase 2: EM Coupling
      // The current (f1) drives the vector potential, and A exerts a force on f1
      if (m === 1) {
         rhs[m] = termNext + termPrev + this.induction * A;
      } else {
         rhs[m] = termNext + termPrev;
      }
    }

    // 2. Wave Equation for A_parallel (Transverse Maxwell)
    // d^2A/dt^2 + k^2 A = Current Coupling
    const current = f[1];
    rhs[M + 1] = dAdt;
    rhs[M + 2] = -Math.pow(this.k, 2) * A + this.induction * current - 0.02 * dAdt; // Damped wave

    return rhs;
  }

  step() {
    const h = this.dt;
    const k1 = this.computeRHS(this.state);
    const k2 = this.computeRHS(this.state.map((v, i) => v + h/2 * k1[i]));
    const k3 = this.computeRHS(this.state.map((v, i) => v + h/2 * k2[i]));
    const k4 = this.computeRHS(this.state.map((v, i) => v + h * k3[i]));
    
    this.state = this.state.map((v, i) => v + (h/6) * (k1[i] + 2*k2[i] + 2*k3[i] + k4[i]));
    this.time += h;

    // Diagnostics
    const electricEnergy = Math.pow(this.state[0], 2) * 0.5;
    const magneticEnergy = (Math.pow(this.state[this.M + 1], 2) * Math.pow(this.k, 2) + Math.pow(this.state[this.M + 2], 2)) * this.beta;
    const kineticEnergy = this.state.slice(1, this.M + 1).reduce((acc, v, idx) => acc + v*v * (idx + 0.5), 0) * 0.1;

    return {
      t: this.time,
      eField: this.state[0],
      aField: this.state[this.M + 1],
      electricEnergy,
      magneticEnergy,
      kineticEnergy,
      totalEnergy: electricEnergy + magneticEnergy + kineticEnergy,
      massError: Math.abs(this.state[0] - phase2Config.physics.alpha)
    };
  }

  reset() {
    this.time = 0;
    this.state = new Array(this.M + 3).fill(0);
    this.state[0] = phase2Config.physics.alpha;
    this.state[this.M + 1] = 0.005;
  }
}
