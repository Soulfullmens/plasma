
import { phase2Config } from '../experiments/config/phase2';

/**
 * Phase 2: KREHM-Lite Final Verification & Scaling Engine
 * Task 2.3: Order Scaling (M = 8, 12, 16)
 */

export class KrehmSolver {
  public M_LIMIT: number = 8;
  private readonly M_TRUTH: number = 64; 
  public k: number = phase2Config.physics.k;
  private beta: number = phase2Config.physics.beta;
  private dt: number = phase2Config.physics.dt;
  private induction: number = phase2Config.physics.induction_strength;
  
  public time: number = 0;
  
  private truthState: number[] = [];
  private truncatedState: number[] = [];
  private hybridState: number[] = [];

  constructor(initialM: number = 8) {
    this.M_LIMIT = initialM;
    this.reset();
  }

  // Pure function for the Phase 1 calibrated closure
  private getNeuralClosure(state: number[], M: number): number {
    // The closure learned in Phase 1 (M=8) is tested for stability at M=12, 16
    return state[M] * 0.82561; 
  }

  private computeRHS(state: number[], M: number, useClosure: boolean): number[] {
    const rhs = new Array(M + 3).fill(0);
    const f = state.slice(0, M + 1);
    const A = state[M + 1]; 
    const dAdt = state[M + 2];
    const f_plus_one = useClosure ? this.getNeuralClosure(state, M) : 0;

    for (let m = 0; m <= M; m++) {
      let termNext = (m < M) ? -this.k * Math.sqrt((m + 1) / 2) * f[m + 1] : -this.k * Math.sqrt((m + 1) / 2) * f_plus_one;
      let termPrev = (m > 0) ? -this.k * Math.sqrt(m / 2) * f[m - 1] : 0;
      
      if (m === 1) {
         rhs[m] = termNext + termPrev + this.induction * A;
      } else {
         rhs[m] = termNext + termPrev;
      }
    }

    rhs[M + 1] = dAdt;
    rhs[M + 2] = -Math.pow(this.k, 2) * A + this.induction * f[1] - 0.02 * dAdt;

    return rhs;
  }

  private rk4Step(state: number[], M: number, useClosure: boolean): number[] {
    const h = this.dt;
    const k1 = this.computeRHS(state, M, useClosure);
    const k2 = this.computeRHS(state.map((v, i) => v + h/2 * k1[i]), M, useClosure);
    const k3 = this.computeRHS(state.map((v, i) => v + h/2 * k2[i]), M, useClosure);
    const k4 = this.computeRHS(state.map((v, i) => v + h * k3[i]), M, useClosure);
    return state.map((v, i) => v + (h/6) * (k1[i] + 2*k2[i] + 2*k3[i] + k4[i]));
  }

  step() {
    this.truthState = this.rk4Step(this.truthState, this.M_TRUTH, false);
    this.truncatedState = this.rk4Step(this.truncatedState, this.M_LIMIT, false);
    this.hybridState = this.rk4Step(this.hybridState, this.M_LIMIT, true);
    
    // Boundary Energy Flux: Q_M = k * sqrt((M+1)/2) * f_M * f_{M+1}
    const fM = this.hybridState[this.M_LIMIT];
    const fMplus1 = this.getNeuralClosure(this.hybridState, this.M_LIMIT);
    const flux = this.k * Math.sqrt((this.M_LIMIT + 1) / 2) * fM * fMplus1;

    this.time += this.dt;

    return {
      t: this.time,
      aTruth: this.truthState[this.M_TRUTH + 1],
      aHybrid: this.hybridState[this.M_LIMIT + 1],
      flux,
      hHybrid: Math.pow(this.hybridState[0], 2) * 0.5 + 
                (Math.pow(this.hybridState[this.M_LIMIT + 1], 2) * Math.pow(this.k, 2)) * this.beta,
      hTruth: Math.pow(this.truthState[0], 2) * 0.5 + 
               (Math.pow(this.truthState[this.M_TRUTH + 1], 2) * Math.pow(this.k, 2)) * this.beta
    };
  }

  reset() {
    this.time = 0;
    const alpha = phase2Config.physics.alpha;
    const aSeed = 0.005;
    this.truthState = new Array(this.M_TRUTH + 3).fill(0);
    this.truthState[0] = alpha;
    this.truthState[this.M_TRUTH + 1] = aSeed;
    this.truncatedState = new Array(this.M_LIMIT + 3).fill(0);
    this.truncatedState[0] = alpha;
    this.truncatedState[this.M_LIMIT + 1] = aSeed;
    this.hybridState = new Array(this.M_LIMIT + 3).fill(0);
    this.hybridState[0] = alpha;
    this.hybridState[this.M_LIMIT + 1] = aSeed;
  }
}
