from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

from extensions import db
from routes.auth import auth_bp
from routes.habits import habits_bp
from routes.completions import completions_bp

load_dotenv()

def create_app():
    app = Flask(__name__)

    db_url = os.environ.get("DATABASE_URL", "").replace("postgres://", "postgresql://")
    if "supabase.co" in db_url and "sslmode" not in db_url:
        db_url += "?sslmode=require"

    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "connect_args": {"sslmode": "require"},
        "pool_pre_ping": True,
    }
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "dev-secret-change-me")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False

    db.init_app(app)
    JWTManager(app)

    # Allow all origins — safe for a portfolio project
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=False)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(habits_bp, url_prefix="/api/habits")
    app.register_blueprint(completions_bp, url_prefix="/api/completions")

    @app.before_request
    def create_tables():
        db.create_all()
        app.before_request_funcs[None].remove(create_tables)

    @app.route("/api/health")
    def health():
        return {"status": "ok"}

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)