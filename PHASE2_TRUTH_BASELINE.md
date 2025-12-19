
# Phase 2: EM Truth Baseline (Reference)

This document establishes the "Truth" behavior of the Electromagnetic (EM) system before the introduction of any neural closures.

## Configuration
- **Dimensionality**: 1D-1V + Transverse $A_{\parallel}$
- **Resolution ($M$**): 64 (Spectral Truth)
- **Plasma Beta ($\beta$**): 0.1
- **Induction Strength**: 0.05
- **Wavenumber ($k$**): 0.4

## Expected Dynamics
1. **Energy Partitioning**: Initial longitudinal energy (Electric) should partially transfer to transverse energy (Magnetic) via inductive coupling with the $f_1$ moment.
2. **Damping**: The total system energy must show a monotonic decay (Landau-like damping) as energy cascades into high-order Hermite moments ($m \to M$).
3. **Coupling**: The $f_1$ (current) moment should oscillate in phase-lag with $A_{\parallel}$, consistent with reduced Ohm's law.

## Verification Metrics
- **Mass Conservation**: $|\int f dv - 1| < 10^{-14}$
- **Total Energy Flux**: $\frac{d}{dt}(W_E + W_B + W_K) \le 0$
- **Recurrence Time ($T_{rec}$**): For $M=64, k=0.4 \implies T_{rec} \approx 125.6 \omega_{pe}^{-1}$.
