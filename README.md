
# PlasmaMind-LD Phase 1: Reprodicibility Suite

This repository contains the scientific artifact for Phase 1 of the PlasmaMind-LD project: **Approximating Unresolved Hermite Flux via Local Neural Closures in 1D-1V Vlasov-Poisson Systems.**

## Reprodicibility (Headless)

To reproduce the primary Phase 1 results (Damping rates, recurrence suppression, and conservation):

1.  Open the **Validation** dashboard.
2.  Click **"Generate Reproduction Report"**.
3.  The output JSON artifact reproduces Figure 1 and Table 1 of the manuscript.

### Expected Quantitative Artifact
```json
{
  "metrics": {
    "gamma_truth": -0.1533xx,
    "gamma_hybrid": -0.153xxx,
    "rel_error_hybrid": < 1.0e-2
  },
  "stability": {
    "recurrence_suppression_db": > 40.0
  }
}
```

## Failure Mode Disclosure
The local spectral closure provided in Phase 1 is designed for the **Linear and Weakly Nonlinear** regimes ($\alpha < 0.1$). 
- **Strong Trapping**: For amplitudes $\alpha \ge 0.1$, the closure loses admissibility as mode coupling at the boundary $M$ becomes non-local.
- **Turbulence**: Fully developed turbulence is outside the scope of Phase 1 and will be addressed in Phase 2 scaling.
