
export const phase1Config = {
  "metadata": {
    "project": "PlasmaMind-LD",
    "phase": 1,
    "lock_tag": "phase1-final"
  },
  "physics": {
    "k": 0.5,
    "alpha": 0.05,
    "M_coarse": 8,
    "M_truth": 128,
    "dt": 0.04,
    "t_fit": [15.0, 45.0],
    "max_steps": 1500
  },
  "reproducibility": {
    "seed": 42,
    "expected_gamma": -0.1533
  }
};
