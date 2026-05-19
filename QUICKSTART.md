# Quickstart Guide

This guide helps you set up the Progress Tracker project on a new environment.

---

## 1. Clone the Repository

```
git clone <your-repo-url>
cd progress_tracker
```

## 2. Backend Setup (Python/FastAPI)

1. Create a virtual environment:
   - Windows:
     ```
     python -m venv venv
     venv\Scripts\activate
     ```
   - Mac/Linux:
     ```
     python3 -m venv venv
     source venv/bin/activate
     ```
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the backend server:
   ```
   uvicorn backend.main:app --reload
   ```

---

## 3. Frontend Setup (React)

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```
2. Start the development server:
   ```
   npm start
   ```

---

## 4. Open the App

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

---

## 5. Additional Notes

- Make sure you have Python 3.10+ and Node.js 18+ installed.
- The SQLite database file (`progress_tracker.db`) will be created automatically in the project root.
- To use the AI Study Guide, set your Gemini API key in the app Settings page.
