
# PlasmaMind-LD Phase 1: Scientific Artifact

This repository contains the **TRL-3 Proof-of-Concept** for neural closures in kinetic plasma physics. 
It demonstrates the suppression of unphysical recurrence in truncated Hermite-Vlasov simulations using a local spectral MLP.

## Phase 1 Reproducibility (Headless)

To reproduce the scientific core of the project (Table 1 and Fig 1 of the manuscript) without the dashboard:

```bash
# 1. Install dependencies
npm install

# 2. Run reproduction benchmark
# (This script uses the fixed seed in experiments/config/phase1.ts)
node -e "import('./experiments/phase1_benchmark.ts').then(m => m.runPhase1Benchmark())"
```

**Expected Outputs:**
- **Console Table**: Comparison of Truth (M=128) vs. Truncated (M=8) vs. Hybrid (MLP).
- **Gamma Verification**: Hybrid damping rate within <1% relative error of truth.
- **Stability Artifact**: Confirmation of mass conservation at machine precision (~1e-15).

## What we do NOT claim (Scientific Disclosure)

This work is strictly limited to the **Linear and Weakly Nonlinear** regimes of the 1D-1V Electrostatic Vlasov-Poisson system.

1. **Strong Trapping**: We do not claim validity for regimes with high perturbation amplitudes ($\alpha \ge 0.1$), where phase-space structures become non-local in Hermite space.
2. **Turbulence**: Fully developed 2D/3D turbulence is outside the scope of Phase 1.
3. **Entropy**: This closure does not explicitly enforce the H-theorem or monotonic entropy growth; it is a dissipative surrogate for phase mixing.
4. **Generalization**: The MLP is local to spectral space ($k$); global generalization across arbitrary wavenumbers is reserved for Phase 2.

## Project Structure (Science-First)
- `experiments/`: Master benchmark scripts and scientific configs.
- `physics/`: The AW-Hermite-Fourier solver core.
- `results/`: Cached JSON artifacts and metrics (git-ignored in production).
- `dashboard/`: (Optional) UI for real-time visualization of trajectories.
