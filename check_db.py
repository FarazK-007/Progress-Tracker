import sqlite3
conn = sqlite3.connect('progress_tracker.db')
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [r[0] for r in cursor.fetchall()]
print("DB TABLES:", tables)
for t in tables:
    cursor.execute(f"SELECT COUNT(*) FROM [{t}]")
    count = cursor.fetchone()[0]
    cursor.execute(f"PRAGMA table_info([{t}])")
    cols = [r[1] for r in cursor.fetchall()]
    print(f"  {t}: {count} rows | Columns: {cols}")
    if count > 0:
        cursor.execute(f"SELECT * FROM [{t}] LIMIT 2")
        rows = cursor.fetchall()
        for row in rows:
            print(f"    -> {row}")
conn.close()
