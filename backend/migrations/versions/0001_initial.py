"""Create startup predictor tables.

Revision ID: 0001_initial
Revises:
"""
from alembic import op
import sqlalchemy as sa

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table("users", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("username", sa.String(80), nullable=False), sa.Column("email", sa.String(160), nullable=False), sa.Column("password_hash", sa.String(255), nullable=False), sa.Column("role", sa.String(30), nullable=False), sa.Column("is_active", sa.Boolean(), nullable=False), sa.Column("created_at", sa.DateTime(), nullable=False))
    op.create_index("ix_users_username", "users", ["username"], unique=True); op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_table("predictions", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False), sa.Column("startup_name", sa.String(160), nullable=False), sa.Column("country", sa.String(80), nullable=False), sa.Column("industry", sa.String(80), nullable=False), sa.Column("funding", sa.Float(), nullable=False), sa.Column("team_size", sa.Integer(), nullable=False), sa.Column("experience", sa.Float(), nullable=False), sa.Column("revenue", sa.Float(), nullable=False), sa.Column("burn_rate", sa.Float(), nullable=False), sa.Column("market_size", sa.Float(), nullable=False), sa.Column("product_stage", sa.String(40), nullable=False), sa.Column("investors", sa.Integer(), nullable=False), sa.Column("competition", sa.Float(), nullable=False), sa.Column("growth_rate", sa.Float(), nullable=False), sa.Column("prediction", sa.String(20), nullable=False), sa.Column("probability", sa.Float(), nullable=False), sa.Column("model_accuracy", sa.Float(), nullable=False), sa.Column("created_at", sa.DateTime(), nullable=False))
    op.create_index("ix_predictions_created_at", "predictions", ["created_at"])
    op.create_table("api_logs", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True), sa.Column("event", sa.String(40), nullable=False), sa.Column("method", sa.String(10), nullable=False), sa.Column("path", sa.String(255), nullable=False), sa.Column("status_code", sa.Integer(), nullable=False), sa.Column("detail", sa.Text(), nullable=True), sa.Column("created_at", sa.DateTime(), nullable=False))
    op.create_index("ix_api_logs_created_at", "api_logs", ["created_at"])
    op.create_table("login_events", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True), sa.Column("success", sa.Boolean(), nullable=False), sa.Column("created_at", sa.DateTime(), nullable=False))
    op.create_index("ix_login_events_created_at", "login_events", ["created_at"])

def downgrade():
    op.drop_table("login_events"); op.drop_table("api_logs"); op.drop_table("predictions"); op.drop_table("users")
