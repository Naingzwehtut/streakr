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

    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "").replace("postgres://", "postgresql://")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "dev-secret-change-me")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False

    db.init_app(app)
    JWTManager(app)

    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
    CORS(app, resources={r"/api/*": {"origins": [frontend_url, "http://localhost:5173"]}}, supports_credentials=True)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(habits_bp, url_prefix="/api/habits")
    app.register_blueprint(completions_bp, url_prefix="/api/completions")

    with app.app_context():
        db.create_all()

    @app.route("/api/health")
    def health():
        return {"status": "ok"}

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
