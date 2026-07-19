import unittest
import asyncio
from datetime import UTC, datetime
from io import BytesIO
from fastapi import HTTPException, Request
from pydantic import ValidationError
from starlette.datastructures import UploadFile
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.database import Base
from backend.csv_service import analyze_csv
from backend.main import (
    analytics,
    change_password,
    dashboard,
    history,
    login,
    predict_csv,
    pwd_context,
    simulate,
    update_profile,
    update_user,
    users as list_users,
)
from backend.models import LoginEvent, Prediction, User
from backend.schemas import (
    AuthRequest,
    PasswordChange,
    PredictionCreate,
    ProfileUpdate,
    RegisterRequest,
    UserAdminUpdate,
)
from backend.services import analyze_startup, score_startup

class StartupScoringTests(unittest.TestCase):
    sample = {
        "startup_name": "Test Labs", "country": "India", "industry": "SaaS",
        "funding": 900000, "team_size": 14, "experience": 7, "revenue": 280000,
        "burn_rate": 50000, "market_size": 120000000, "product_stage": "Early Revenue",
        "investors": 3, "competition": 52, "growth_rate": 44,
    }

    def test_prediction_is_bounded_and_labeled(self):
        label, probability = score_startup(self.sample)
        self.assertIn(label, {"Likely to succeed", "High risk"})
        self.assertGreaterEqual(probability, 0)
        self.assertLessEqual(probability, 1)

    def test_request_validation_rejects_unsupported_values(self):
        invalid = {**self.sample, "product_stage": "Prototype"}
        with self.assertRaises(ValidationError):
            PredictionCreate.model_validate(invalid)

        with self.assertRaises(ValidationError):
            RegisterRequest(username="bad user", email="user@example.com", password="short")

    def test_analysis_exposes_bounded_explainable_scores(self):
        analysis = analyze_startup(
            self.sample,
            probability=0.72,
            accuracy=0.88,
            peer_probabilities=[0.31, 0.58, 0.69, 0.81],
            benchmark_scope="SaaS workspace peers",
        )

        self.assertGreaterEqual(analysis["success_index"], 0)
        self.assertLessEqual(analysis["success_index"], 100)
        self.assertEqual(len(analysis["dimensions"]), 4)
        self.assertTrue(analysis["explanations"])
        self.assertEqual(analysis["benchmark"]["peer_count"], 4)
        self.assertLessEqual(
            analysis["confidence_interval"]["lower"],
            analysis["confidence_interval"]["upper"],
        )
        self.assertTrue(all(0 <= item["risk"] <= 100 for item in analysis["risk_heatmap"]))


class CsvIntelligenceTests(unittest.TestCase):
    def test_alias_mapping_and_validation(self):
        content = (
            "company,location,sector,total_funding,employees,founder_experience,"
            "annual_revenue,monthly_burn,tam,stage,investor_count,competition_index,yoy_growth\n"
            "Alias Labs,India,SaaS,900000,14,7,280000,50000,120000000,Early Revenue,3,52,44%\n"
        ).encode()

        result = analyze_csv(content)

        self.assertEqual(result["valid_count"], 1)
        self.assertEqual(result["invalid_count"], 0)
        self.assertEqual(result["mapping"]["startup_name"], "company")
        self.assertEqual(result["preview"][0]["growth_rate"], 44)


class WorkspaceIsolationTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        Base.metadata.create_all(self.engine)
        self.session = sessionmaker(bind=self.engine)()
        self.alice = User(username="alice", email="alice@example.com", password_hash="x")
        self.bob = User(username="bob", email="bob@example.com", password_hash="x")
        self.session.add_all([self.alice, self.bob])
        self.session.commit()
        self.session.add_all([
            self.prediction(self.alice.id, "Alice Labs", "SaaS", 0.8),
            self.prediction(self.bob.id, "Bob Health", "Healthtech", 0.2),
        ])
        self.session.commit()

    def tearDown(self):
        self.session.close()
        self.engine.dispose()

    @staticmethod
    def prediction(user_id, name, industry, probability):
        return Prediction(
            user_id=user_id,
            startup_name=name,
            country="India",
            industry=industry,
            funding=500_000,
            team_size=10,
            experience=5,
            revenue=100_000,
            burn_rate=30_000,
            market_size=50_000_000,
            product_stage="MVP",
            investors=2,
            competition=50,
            growth_rate=25,
            prediction="Likely to succeed" if probability >= 0.5 else "High risk",
            probability=probability,
            model_accuracy=0.9,
            created_at=datetime.now(UTC).replace(tzinfo=None),
        )

    def test_analyst_dashboard_and_history_only_include_own_predictions(self):
        dashboard_data = dashboard(db=self.session, user=self.alice)
        history_data = history(db=self.session, user=self.alice)

        self.assertEqual(dashboard_data["stats"]["total_predictions"], 1)
        self.assertEqual([item["startup_name"] for item in dashboard_data["recent"]], ["Alice Labs"])
        self.assertEqual([item["startup_name"] for item in history_data["items"]], ["Alice Labs"])
        self.assertEqual(dashboard_data["latest_analysis"]["startup"]["startup_name"], "Alice Labs")
        self.assertIn("success_index", dashboard_data["latest_analysis"]["analysis"])

    def test_analyst_analytics_only_include_own_workspace(self):
        data = analytics(db=self.session, user=self.alice)

        self.assertEqual(data["stats"]["total_predictions"], 1)
        self.assertEqual([item["name"] for item in data["industries"]], ["SaaS"])
        self.assertEqual([item["name"] for item in data["users"]], ["alice"])

    def test_simulation_does_not_persist(self):
        before = self.session.query(Prediction).count()
        payload = PredictionCreate.model_validate({
            "startup_name": "Scenario Labs", "country": "India", "industry": "SaaS",
            "funding": 1200000, "team_size": 16, "experience": 8, "revenue": 400000,
            "burn_rate": 45000, "market_size": 140000000, "product_stage": "Early Revenue",
            "investors": 3, "competition": 48, "growth_rate": 52,
        })

        result = simulate(payload=payload, db=self.session, user=self.alice)

        self.assertFalse(result["persisted"])
        self.assertIn("success_index", result["analysis"])
        self.assertEqual(self.session.query(Prediction).count(), before)

    def test_csv_batch_persists_valid_rows(self):
        content = (
            "startup_name,country,industry,funding,team_size,experience,revenue,"
            "burn_rate,market_size,product_stage,investors,competition,growth_rate\n"
            "Batch Labs,India,Fintech,800000,10,6,200000,40000,90000000,MVP,2,50,35\n"
        ).encode()
        upload = UploadFile(filename="batch.csv", file=BytesIO(content))
        before = self.session.query(Prediction).count()

        result = asyncio.run(predict_csv(file=upload, db=self.session, user=self.alice))

        self.assertEqual(result["created"], 1)
        self.assertEqual(result["skipped"], 0)
        self.assertEqual(result["results"][0]["startup_name"], "Batch Labs")
        self.assertEqual(self.session.query(Prediction).count(), before + 1)


class AccountManagementTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        Base.metadata.create_all(self.engine)
        self.session = sessionmaker(bind=self.engine)()
        self.admin = User(
            username="admin",
            email="admin@example.com",
            password_hash=pwd_context.hash("adminpass"),
            role="admin",
        )
        self.analyst = User(
            username="analyst",
            email="analyst@example.com",
            password_hash=pwd_context.hash("analystpass"),
        )
        self.session.add_all([self.admin, self.analyst])
        self.session.commit()

    def tearDown(self):
        self.session.close()
        self.engine.dispose()

    @staticmethod
    def request():
        return Request({"type": "http", "method": "POST", "path": "/login", "headers": []})

    def test_inactive_user_cannot_log_in(self):
        self.analyst.is_active = False
        self.session.commit()

        with self.assertRaises(HTTPException) as raised:
            login(
                payload=AuthRequest(username="analyst", password="analystpass"),
                request=self.request(),
                db=self.session,
            )

        self.assertEqual(raised.exception.status_code, 401)
        event = self.session.query(LoginEvent).order_by(LoginEvent.id.desc()).first()
        self.assertFalse(event.success)

    def test_profile_can_be_updated_but_must_remain_unique(self):
        result = update_profile(
            payload=ProfileUpdate(username="renamed", email="renamed@example.com"),
            db=self.session,
            user=self.analyst,
        )
        self.assertEqual(result.username, "renamed")
        self.assertEqual(result.email, "renamed@example.com")

        with self.assertRaises(HTTPException) as raised:
            update_profile(
                payload=ProfileUpdate(username="admin", email="other@example.com"),
                db=self.session,
                user=self.analyst,
            )
        self.assertEqual(raised.exception.status_code, 409)

    def test_password_change_requires_current_password(self):
        with self.assertRaises(HTTPException) as raised:
            change_password(
                payload=PasswordChange(
                    current_password="incorrect",
                    new_password="replacementpass",
                ),
                db=self.session,
                user=self.analyst,
            )
        self.assertEqual(raised.exception.status_code, 400)

        change_password(
            payload=PasswordChange(
                current_password="analystpass",
                new_password="replacementpass",
            ),
            db=self.session,
            user=self.analyst,
        )
        self.assertTrue(pwd_context.verify("replacementpass", self.analyst.password_hash))

    def test_only_admin_can_manage_users(self):
        listed = list_users(db=self.session, user=self.admin)
        self.assertEqual(len(listed["items"]), 2)

        with self.assertRaises(HTTPException) as raised:
            list_users(db=self.session, user=self.analyst)
        self.assertEqual(raised.exception.status_code, 403)

        updated = update_user(
            user_id=self.analyst.id,
            payload=UserAdminUpdate(role="admin", is_active=False),
            db=self.session,
            user=self.admin,
        )
        self.assertEqual(updated.role, "admin")
        self.assertFalse(updated.is_active)

        with self.assertRaises(HTTPException) as raised:
            update_user(
                user_id=self.admin.id,
                payload=UserAdminUpdate(is_active=False),
                db=self.session,
                user=self.admin,
            )
        self.assertEqual(raised.exception.status_code, 400)

if __name__ == "__main__":
    unittest.main()
