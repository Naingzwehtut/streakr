# 🔥 Streakr — Habit Tracker

A full-stack habit tracking app with streaks, calendar history, progress charts, and user authentication.

**Stack:** React + Vite · Python Flask · PostgreSQL (Supabase) · Deployed on Vercel + Render

---

## Features

- Sign up / login with JWT authentication
- Create, edit, delete daily habits (emoji + color)
- Mark habits complete each day with one click
- Streak counter that increases on consecutive days, resets when missed
- 7-day dot trail per habit on the Today view
- 30-day calendar with color-coded completion rate
- Stats dashboard with weekly bar chart and per-habit streak chart
- Dark / light mode toggle
- Mobile-friendly responsive UI

---

## Project Structure

```
streakr/
├── backend/          # Flask API
│   ├── app.py
│   ├── models.py
│   ├── extensions.py
│   ├── routes/
│   │   ├── auth.py
│   │   ├── habits.py
│   │   └── completions.py
│   ├── requirements.txt
│   └── render.yaml
└── frontend/         # React + Vite
    ├── src/
    │   ├── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.css
    │   ├── context/
    │   ├── hooks/
    │   ├── pages/
    │   └── components/
    ├── package.json
    ├── vite.config.js
    └── vercel.json
```

---

## Local Development

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/streakr.git
cd streakr
```

### 2. Set up the database (Supabase)

1. Go to [supabase.com](https://supabase.com) → New project
2. After creation, go to **Settings → Database**
3. Copy the **Connection string (URI)** — it looks like:
   `postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres`

### 3. Run the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env — paste your Supabase DATABASE_URL and set a JWT_SECRET_KEY
```

Generate a secure JWT secret:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

Start the server:
```bash
flask run
# Running on http://localhost:5000
```

### 4. Run the frontend

```bash
cd ../frontend
npm install

cp .env.example .env
# .env already has VITE_API_URL=http://localhost:5000 for local dev

npm run dev
# Running on http://localhost:5173
```

---

## Deployment

### Deploy backend to Render (free)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo, select the `backend` folder as root
4. Set:
   - **Build command:** `pip install -r requirements.txt`
   - **Start command:** `gunicorn app:app`
5. Add environment variables:
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Your Supabase connection string |
   | `JWT_SECRET_KEY` | Your generated secret |
   | `FRONTEND_URL` | `https://your-app.vercel.app` (fill after Vercel deploy) |
6. Deploy — note your Render URL e.g. `https://streakr-api.onrender.com`

### Deploy frontend to Vercel (free)

1. Go to [vercel.com](https://vercel.com) → New Project → import your GitHub repo
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://streakr-api.onrender.com` |
4. Deploy
5. Go back to Render → update `FRONTEND_URL` to your Vercel URL

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Sign in |
| GET | `/api/auth/me` | ✓ | Get current user |
| GET | `/api/habits/` | ✓ | List habits with streaks |
| POST | `/api/habits/` | ✓ | Create habit |
| PUT | `/api/habits/:id` | ✓ | Update habit |
| DELETE | `/api/habits/:id` | ✓ | Soft-delete habit |
| GET | `/api/completions/?days=30` | ✓ | Get completions |
| POST | `/api/completions/toggle` | ✓ | Toggle completion |
| GET | `/api/health` | — | Health check |

---

## Built With

- [Flask](https://flask.palletsprojects.com/) — Python web framework
- [SQLAlchemy](https://www.sqlalchemy.org/) — ORM
- [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/) — JWT auth
- [React](https://react.dev/) — UI library
- [Vite](https://vitejs.dev/) — Build tool
- [Chart.js](https://www.chartjs.org/) — Charts
- [Supabase](https://supabase.com/) — Managed PostgreSQL
- [Render](https://render.com/) — Backend hosting
- [Vercel](https://vercel.com/) — Frontend hosting
