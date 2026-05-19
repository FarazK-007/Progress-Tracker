import sqlite3

conn = sqlite3.connect('progress_tracker.db')
cursor = conn.cursor()

# 1. Clean up job_applications - these 20 rows are actually TargetCompanies data
print("Cleaning up bad data in job_applications...")
cursor.execute("DELETE FROM job_applications")
deleted = cursor.rowcount
print(f"  Deleted {deleted} incorrectly migrated rows from job_applications")

# 2. Verify target_companies has data
cursor.execute("SELECT COUNT(*) FROM target_companies")
tc_count = cursor.fetchone()[0]
print(f"  target_companies: {tc_count} rows (should be 20)")

# 3. Verify other tables
for table in ['daily_plan', 'project_milestones', 'question_bank']:
    cursor.execute(f"SELECT COUNT(*) FROM [{table}]")
    count = cursor.fetchone()[0]
    print(f"  {table}: {count} rows")

conn.commit()
conn.close()
print("\nDone! Database is now clean.")
