import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "progress_tracker.db")

def list_tables():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    print(cursor.fetchall())
    conn.close()

if __name__ == "__main__":
    list_tables()
