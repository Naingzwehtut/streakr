from extensions import db
from datetime import datetime, date

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    habits = db.relationship("Habit", backref="user", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {"id": self.id, "name": self.name, "email": self.email}


class Habit(db.Model):
    __tablename__ = "habits"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    emoji = db.Column(db.String(10), default="✨")
    color = db.Column(db.String(20), default="#534AB7")
    created_at = db.Column(db.Date, default=date.today)
    is_active = db.Column(db.Boolean, default=True)
    completions = db.relationship("Completion", backref="habit", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "emoji": self.emoji,
            "color": self.color,
            "created_at": self.created_at.isoformat(),
            "is_active": self.is_active,
        }


class Completion(db.Model):
    __tablename__ = "completions"
    id = db.Column(db.Integer, primary_key=True)
    habit_id = db.Column(db.Integer, db.ForeignKey("habits.id"), nullable=False)
    completed_date = db.Column(db.Date, nullable=False)
    __table_args__ = (db.UniqueConstraint("habit_id", "completed_date"),)

    def to_dict(self):
        return {"habit_id": self.habit_id, "completed_date": self.completed_date.isoformat()}
