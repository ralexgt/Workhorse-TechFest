from pathlib import Path
import joblib
import pandas as pd
import json

from utils.price_model import price_for
from utils.knapsack import select_under_budget


MANDATORY_FIRST = ["isolate_12v_battery"]

def load_artifacts(artifacts_dir: str, components: list[str]):
    base = Path(artifacts_dir)
    bundles = {}
    for comp in components:
        bundles[comp] = {
            "pre": joblib.load(base / f"{comp}_preprocessor.pkl"),
            "time": joblib.load(base / f"{comp}_time.pkl"),
            "succ": joblib.load(base / f"{comp}_success_calibrated.pkl"),
        }
    return bundles

def infer_and_plan(job: dict, artifacts_dir: str) -> dict:
    df_job = pd.DataFrame([job])   
    # >>> NEW: inject default ease_of_acces if the app doesn't provide it
    if "ease_of_acces(0-2)" not in df_job.columns:
        df_job["ease_of_acces(0-2)"] = 1  # 0=easiest, 1=medium (neutral), 2=hardest
    components = [p.stem.replace("_time","") for p in Path(artifacts_dir).glob("*_time.pkl")]
    bundles = load_artifacts(artifacts_dir, components)

    preds = []
    for comp in components:
        b = bundles[comp]
        X = b["pre"].transform(b["pre"].add_derived.transform(df_job))
        t = float(b["time"].predict(X)[0])
        p = float(b["succ"].predict_proba(X)[0,1])
        preds.append({"component": comp, "t": t, "p": p})

    # business parameters
    time_budget = int(job.get("time_budget_min", 90))
    labor_rate = float(job.get("labor_rate_per_min_eur", 0.5))
    vt = job["vehicle_type"]

    items, negatives, too_long = [], {}, {}
    for r in preds:
        price_eur = price_for(r["component"], job["year"], job["severity_of_accident(0-5)"],
                              job["grade_of_rust(0-5)"], job["is_flooded"], vt)
        exp_profit = r["p"] * (price_eur - labor_rate * r["t"])
        if exp_profit <= 0:
            negatives[r["component"]] = "negative expected profit"
            continue
        if r["t"] > time_budget:
            too_long[r["component"]] = f"time {r['t']:.1f} > budget {time_budget}"
            continue
        items.append({"component": r["component"], "t": r["t"], "p": r["p"], "profit": exp_profit})

    chosen = select_under_budget(items, capacity=time_budget)
    chosen.sort(key=lambda x: (-x["profit"]/max(1e-6,x["t"]), x["t"]))

    selected = [{"component": it["component"], "pred_time_min": round(it["t"],2),
                 "success_prob": round(it["p"],2), "expected_profit_eur": round(it["profit"],2)}
                for it in chosen]

    totals = {"time_min": round(sum(it["t"] for it in chosen),2),
              "expected_profit_eur": round(sum(it["profit"] for it in chosen),2)}

    return {"mandatory_first": MANDATORY_FIRST,
            "selected_order": selected,
            "skipped": {**negatives, **too_long},
            "totals": totals}


if __name__ == "__main__":

    job = {
        "year": 2019, "odometer": 80000, "grade_of_rust(0-5)": 4,
        "accident_zone": "front", "severity_of_accident(0-5)": 4,
        "is_flooded": 0, "vehicle_type": "ev",
        "time_budget_min": 90, "labor_rate_per_min_eur": 0.5,
    }
    print(json.dumps(infer_and_plan(job, "artifacts/"), indent=2))
