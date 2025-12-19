
# Phase 1 Scope Lock

**Project:** PlasmaMind-LD  
**Tag:** `phase1-final`  
**Status:** FROZEN  

## Frozen Methodology
1.  **Dimensionality:** Strictly 1D-1V Electrostatic.
2.  **Solver:** AW-Hermite-Fourier Spectral + RK4 (Method of Lines).
3.  **Closure:** Multi-Layer Perceptron (MLP) baseline at $M=8$.
4.  **Benchmarks:** $k=0.5$ Landau Damping ($\gamma = -0.1533$).

## Prohibited Modifications (Phase 1 Branch)
- Addition of Electromagnetic terms (Phase 2).
- Extension to 2D/3D geometry (Phase 2).
- Introduction of Symplectic Splitting (Phase 2).
- Modification of $M=8$ truncation depth.

Any deviations must be committed to the `phase-2-em-scaling` branch.
