from __future__ import annotations
from typing import List, Dict

def select_under_budget(items: List[Dict], capacity: int) -> List[Dict]:
    """
    Exact 0/1 knapsack (dynamic programming).
    items: [{ 'component': str, 't': float, 'profit': float, ... }, ...]
           't' is time in minutes (weight), 'profit' is value (EUR).
    capacity: total time budget in minutes.

    Returns the chosen subset (original dicts), optimal for total profit
    without exceeding capacity.
    """
    if capacity <= 0 or not items:
        return []

    # Round weights to integer minutes for DP table
    weights = [max(0, int(round(it["t"]))) for it in items]
    values = [float(it["profit"]) for it in items]
    n = len(items)
    cap = int(capacity)

    # DP tables
    dp = [[0.0] * (cap + 1) for _ in range(n + 1)]
    take = [[False] * (cap + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        w, v = weights[i - 1], values[i - 1]
        for c in range(cap + 1):
            # Option 1: skip item i-1
            best = dp[i - 1][c]
            choose = False
            # Option 2: take item i-1 if it fits
            if w <= c:
                cand = dp[i - 1][c - w] + v
                if cand > best:
                    best, choose = cand, True
            dp[i][c] = best
            take[i][c] = choose

    # Reconstruct chosen set
    chosen: List[Dict] = []
    c = cap
    for i in range(n, 0, -1):
        if take[i][c]:
            chosen.append(items[i - 1])
            c -= weights[i - 1]
    chosen.reverse()
    return chosen
