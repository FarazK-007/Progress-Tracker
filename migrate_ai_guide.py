import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "progress_tracker.db")

def migrate():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE daily_plan ADD COLUMN ai_guide TEXT;")
        conn.commit()
        print("Successfully added 'ai_guide' column to daily_plan.")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e).lower():
            print("Column 'ai_guide' already exists.")
        else:
            print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
