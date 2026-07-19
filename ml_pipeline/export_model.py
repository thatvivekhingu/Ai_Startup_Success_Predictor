from .train import train
if __name__ == "__main__":
    best, _ = train(); print(f"Exported {best} to backend/model/startup_model.pkl")

