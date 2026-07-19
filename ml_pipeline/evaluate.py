from pathlib import Path
import json

def load_metrics():
    path = Path(__file__).resolve().parents[1] / "backend" / "model" / "metrics.json"
    if not path.exists(): raise FileNotFoundError("Run `python -m ml_pipeline.train` first.")
    return json.loads(path.read_text(encoding="utf-8"))

if __name__ == "__main__": print(json.dumps(load_metrics(), indent=2))

