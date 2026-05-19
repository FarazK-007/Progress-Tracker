# Progress Tracker Web App

A personal productivity and job/interview preparation tracker. Built with React (frontend) and FastAPI (backend).

## Features
- Daily plan and progress tracking
- Job applications tracker
- Study log (topics, hours, confidence)
- Mock interview log
- Project milestone tracker
- Question bank (with answers/confidence)
- Offer comparison
- Reminders/notifications
- Analytics/dashboard

## Tech Stack
- Frontend: React (PWA template)
- Backend: FastAPI (Python)
- Local storage: SQLite (for backend data)

## Getting Started

### Backend (FastAPI)
1. Create and activate the Python virtual environment:
   ```sh
   python -m venv venv
   venv\Scripts\activate  # On Windows
   # or
   source venv/bin/activate  # On Mac/Linux
   ```
2. Install dependencies:
   ```sh
   pip install fastapi uvicorn sqlalchemy pydantic
   ```
3. Run the backend:
   ```sh
   uvicorn backend.main:app --reload
   ```

### Frontend (React)
1. Install dependencies:
   ```sh
   cd frontend
   npm install
   ```
2. Start the frontend:
   ```sh
   npm start
   ```

The React app will run on http://localhost:3000 and the FastAPI backend on http://localhost:8000.

---

## Folder Structure
- `frontend/` — React app (UI)
- `backend/` — FastAPI app (API)
- `.github/` — Copilot instructions

---

## Next Steps
- Implement API endpoints for all modules
- Build React UI for each feature
- Connect frontend to backend

---

*No authentication required. All data is local.*
