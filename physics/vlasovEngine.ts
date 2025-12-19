
/**
 * Simplified Vlasov Solver (Client-side simulation)
 * Uses RK4 and Hermite-Fourier spectral method for 1D-1V.
 * This is meant for UI visualization purposes.
 */

export class VlasovSolver {
  private M: number; // Moments
  private k: number; // Wavenumber
  private alpha: number; // Perturbation amplitude
  private dt: number = 0.05;
  private time: number = 0;
  private state: number[][]; // [Fourier_k][Moment_m] complex state (mag only for simplicity here)

  constructor(M: number = 16, k: number = 0.5, alpha: number = 0.01) {
    this.M = M;
    this.k = k;
    this.alpha = alpha;
    this.state = [[alpha, ...new Array(M).fill(0)]]; 
  }

  // Simplified derivative for a single k mode (linearized)
  private computeRHS(state: number[]): number[] {
    const rhs = new Array(this.M + 1).fill(0);
    const k_val = this.k;

    for (let m = 0; m <= this.M; m++) {
      // Linearized advection: df_m/dt = -i*k*sqrt(m+1/2)f_{m+1} - i*k*sqrt(m/2)f_{m-1}
      // We use a simplified version for visualization (real values)
      let termNext = 0;
      if (m < this.M) {
        termNext = -k_val * Math.sqrt((m + 1) / 2) * state[m + 1];
      }
      
      let termPrev = 0;
      if (m > 0) {
        termPrev = -k_val * Math.sqrt(m / 2) * state[m - 1];
      }

      // Poisson Coupling for m=1 (Current/Momentum)
      if (m === 1) {
        // Simple damping effect based on Poisson
        rhs[m] = termNext + termPrev - 0.2 * state[m];
      } else {
        rhs[m] = termNext + termPrev;
      }
    }
    return rhs;
  }

  step(): { t: number; eField: number; moments: number[] } {
    const y = [...this.state[0]];
    const h = this.dt;

    // Standard RK4
    const k1 = this.computeRHS(y);
    const k2 = this.computeRHS(y.map((v, i) => v + h / 2 * k1[i]));
    const k3 = this.computeRHS(y.map((v, i) => v + h / 2 * k2[i]));
    const k4 = this.computeRHS(y.map((v, i) => v + h * k3[i]));

    const nextY = y.map((v, i) => v + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    
    // Add artificial damping for visualization of Landau effect if not using closure
    // Actual closure would manage this.
    const envelope = Math.exp(-0.153 * this.time);
    const eField = Math.abs(nextY[0]) * envelope;

    this.state[0] = nextY;
    this.time += h;

    return {
      t: this.time,
      eField: eField,
      moments: nextY
    };
  }

  reset() {
    this.time = 0;
    this.state = [[this.alpha, ...new Array(this.M).fill(0)]];
  }
}
