from datetime import UTC, datetime, timedelta

from sqlalchemy.orm import Session

from .models import LoginEvent, Prediction, User


DEMO_PREDICTIONS = [
    ("Northstar AI", "India", "AI / ML", 1_200_000, 18, 8, 410_000, 62_000, 160_000_000, "Early Revenue", 4, 58, 64, 0.82),
    ("Harbor Health", "United States", "Healthtech", 3_800_000, 34, 11, 1_250_000, 170_000, 420_000_000, "Growth", 6, 71, 76, 0.91),
    ("LedgerLeaf", "Singapore", "Fintech", 650_000, 11, 6, 180_000, 48_000, 130_000_000, "MVP", 3, 66, 41, 0.67),
    ("ClassOrbit", "India", "Edtech", 220_000, 7, 4, 35_000, 29_000, 75_000_000, "MVP", 1, 49, 18, 0.38),
    ("TerraGrid", "Germany", "Climate tech", 5_400_000, 42, 14, 1_900_000, 210_000, 610_000_000, "Growth", 7, 54, 89, 0.94),
    ("CartCanvas", "Canada", "E-commerce", 480_000, 13, 5, 260_000, 57_000, 95_000_000, "Early Revenue", 2, 78, 32, 0.56),
    ("QuietOps", "United Kingdom", "SaaS", 1_750_000, 24, 9, 820_000, 96_000, 240_000_000, "Growth", 5, 63, 72, 0.87),
    ("PulsePantry", "United States", "Consumer", 90_000, 5, 3, 8_000, 22_000, 48_000_000, "Idea", 0, 82, -4, 0.18),
]


def seed_demo_workspace(db: Session, demo: User) -> None:
    existing_names = {
        name for (name,) in db.query(Prediction.startup_name).filter(Prediction.user_id == demo.id).all()
    }

    now = datetime.now(UTC).replace(tzinfo=None)
    for index, values in enumerate(DEMO_PREDICTIONS):
        (
            startup_name,
            country,
            industry,
            funding,
            team_size,
            experience,
            revenue,
            burn_rate,
            market_size,
            product_stage,
            investors,
            competition,
            growth_rate,
            probability,
        ) = values
        if startup_name in existing_names:
            continue
        db.add(
            Prediction(
                user_id=demo.id,
                startup_name=startup_name,
                country=country,
                industry=industry,
                funding=funding,
                team_size=team_size,
                experience=experience,
                revenue=revenue,
                burn_rate=burn_rate,
                market_size=market_size,
                product_stage=product_stage,
                investors=investors,
                competition=competition,
                growth_rate=growth_rate,
                prediction="Likely to succeed" if probability >= 0.5 else "High risk",
                probability=probability,
                model_accuracy=1.0,
                created_at=now - timedelta(days=(len(DEMO_PREDICTIONS) - index - 1) * 4),
            )
        )
        db.add(LoginEvent(user_id=demo.id, created_at=now - timedelta(days=index * 3)))
    db.commit()
