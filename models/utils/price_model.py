from __future__ import annotations
from typing import Dict

# Baseline prices in EUR (adjust to your market data)
BASE_PRICES_EUR: Dict[str, float] = {
    "battery": 40.0,        # 12V baseline; EV traction battery is handled via vehicle_type multiplier
    "alternator": 70.0,
    "starter": 55.0,
    "radiator": 45.0,
    "headlight": 35.0,
    "bumper": 30.0,
    "door_front": 80.0,
    "door_rear": 70.0,
    "seat_front": 60.0,
    "mirror_side": 30.0,
}

# Vehicle-type multipliers (domain priors)
# - EV "battery" (traction pack) is worth far more than a 12V battery
# - Alternator/starter don't exist for EVs → multiplier 0 (or filter them out earlier)
VT_MULTIPLIER: Dict[str, Dict[str, float]] = {
    "combustion": {"battery": 1.0, "alternator": 1.0, "starter": 1.0},
    "hybrid":     {"battery": 1.8, "alternator": 1.0, "starter": 1.0},
    "ev":         {"battery": 6.0, "alternator": 0.0, "starter": 0.0},
}

def _condition_multiplier(severity_0_5: int, rust_0_5: int, flood: int) -> float:
    m = 1.0
    m *= max(0.5, 1 - 0.08 * int(severity_0_5))  # crash damage
    m *= max(0.6, 1 - 0.07 * int(rust_0_5))      # corrosion
    if int(flood):
        m *= 0.7                                  # electrical risk
    return float(max(0.2, m))

def _age_multiplier(year: int, ref_year: int = 2025) -> float:
    age = max(0, int(ref_year) - int(year))
    return float(max(0.6, 1 - 0.02 * age))       # floor at 0.6

def price_for(component: str, year: int, severity_0_5: int,
              rust_0_5: int, flood: int, vehicle_type: str) -> float:
    base = float(BASE_PRICES_EUR.get(component, 0.0))
    if base <= 0.0:
        return 0.0

    vt = str(vehicle_type).lower()
    vt_mult = VT_MULTIPLIER.get(vt, {}).get(component, 1.0)

    # If a part should not exist (e.g., alternator on EV) we zero it out
    if vt_mult == 0.0:
        return 0.0

    m = _age_multiplier(year) * _condition_multiplier(severity_0_5, rust_0_5, flood)
    return float(round(base * vt_mult * m, 2))
