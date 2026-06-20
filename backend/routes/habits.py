from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date, timedelta

from extensions import db
from models import Habit, Completion

habits_bp = Blueprint("habits", __name__)


def compute_streak(habit_id):
    today = date.today()
    streak = 0
    check = today
    # If today not done, start from yesterday
    today_done = Completion.query.filter_by(habit_id=habit_id, completed_date=today).first()
    if not today_done:
        check = today - timedelta(days=1)
    while True:
        c = Completion.query.filter_by(habit_id=habit_id, completed_date=check).first()
        if c:
            streak += 1
            check -= timedelta(days=1)
        else:
            break
    return streak


@habits_bp.route("/", methods=["GET"])
@jwt_required()
def get_habits():
    user_id = int(get_jwt_identity())
    habits = Habit.query.filter_by(user_id=user_id, is_active=True).order_by(Habit.created_at).all()
    result = []
    for h in habits:
        d = h.to_dict()
        d["streak"] = compute_streak(h.id)
        result.append(d)
    return jsonify(result)


@habits_bp.route("/", methods=["POST"])
@jwt_required()
def create_habit():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"error": "Name is required"}), 400

    habit = Habit(
        user_id=user_id,
        name=name,
        emoji=data.get("emoji", "✨"),
        color=data.get("color", "#534AB7"),
    )
    db.session.add(habit)
    db.session.commit()
    d = habit.to_dict()
    d["streak"] = 0
    return jsonify(d), 201


@habits_bp.route("/<int:habit_id>", methods=["PUT"])
@jwt_required()
def update_habit(habit_id):
    user_id = int(get_jwt_identity())
    habit = Habit.query.filter_by(id=habit_id, user_id=user_id).first_or_404()
    data = request.get_json()
    if "name" in data:
        habit.name = data["name"].strip() or habit.name
    if "emoji" in data:
        habit.emoji = data["emoji"]
    if "color" in data:
        habit.color = data["color"]
    db.session.commit()
    d = habit.to_dict()
    d["streak"] = compute_streak(habit.id)
    return jsonify(d)


@habits_bp.route("/<int:habit_id>", methods=["DELETE"])
@jwt_required()
def delete_habit(habit_id):
    user_id = int(get_jwt_identity())
    habit = Habit.query.filter_by(id=habit_id, user_id=user_id).first_or_404()
    habit.is_active = False
    db.session.commit()
    return jsonify({"message": "Habit deleted"})
