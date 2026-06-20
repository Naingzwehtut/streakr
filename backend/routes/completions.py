from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date, timedelta

from extensions import db
from models import Habit, Completion

completions_bp = Blueprint("completions", __name__)


@completions_bp.route("/", methods=["GET"])
@jwt_required()
def get_completions():
    user_id = int(get_jwt_identity())
    days = int(request.args.get("days", 30))
    since = date.today() - timedelta(days=days)

    habit_ids = [h.id for h in Habit.query.filter_by(user_id=user_id, is_active=True).all()]
    if not habit_ids:
        return jsonify([])

    comps = Completion.query.filter(
        Completion.habit_id.in_(habit_ids),
        Completion.completed_date >= since
    ).all()

    return jsonify([c.to_dict() for c in comps])


@completions_bp.route("/toggle", methods=["POST"])
@jwt_required()
def toggle_completion():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    habit_id = data.get("habit_id")
    date_str = data.get("date", date.today().isoformat())

    habit = Habit.query.filter_by(id=habit_id, user_id=user_id, is_active=True).first_or_404()
    comp_date = date.fromisoformat(date_str)

    existing = Completion.query.filter_by(habit_id=habit_id, completed_date=comp_date).first()
    if existing:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({"completed": False, "date": date_str})
    else:
        comp = Completion(habit_id=habit_id, completed_date=comp_date)
        db.session.add(comp)
        db.session.commit()
        return jsonify({"completed": True, "date": date_str})
