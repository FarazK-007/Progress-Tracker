import sqlite3

print("=== E:\\progress_tracker.db (backend uses this) ===")
conn1 = sqlite3.connect(r"E:\progress_tracker.db")
c1 = conn1.cursor()
c1.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [r[0] for r in c1.fetchall()]
for t in tables:
    c1.execute(f"SELECT COUNT(*) FROM [{t}]")
    print(f"  {t}: {c1.fetchone()[0]} rows")
conn1.close()

print()
print("=== E:\\progress_tracker\\progress_tracker.db (migration target) ===")
conn2 = sqlite3.connect(r"E:\progress_tracker\progress_tracker.db")
c2 = conn2.cursor()
c2.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables2 = [r[0] for r in c2.fetchall()]
for t in tables2:
    c2.execute(f"SELECT COUNT(*) FROM [{t}]")
    print(f"  {t}: {c2.fetchone()[0]} rows")
conn2.close()
