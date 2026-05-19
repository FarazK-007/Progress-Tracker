import pandas as pd
import sqlite3

conn = sqlite3.connect('progress_tracker.db')
xlsx = pd.ExcelFile(r'E:\bg3\Interview_Prep_Tracker.xlsx')

try:
    print("Migrating Applications...")
    df_app = pd.read_excel(xlsx, 'Applications')
    df_app = df_app.rename(columns={
        'Date Applied': 'date_applied', 'Company': 'company', 'Role': 'role', 
        'Location': 'location', 'Source': 'source', 'Job Link': 'job_link', 
        'Referral?': 'referral', 'Status': 'status', 'Recruiter Contact': 'recruiter_contact', 
        'Next Step': 'next_step', 'Next Step Date': 'next_step_date', 'Notes': 'notes'
    })
    if 'date_applied' in df_app.columns: df_app['date_applied'] = pd.to_datetime(df_app['date_applied']).dt.strftime('%Y-%m-%d')
    if 'next_step_date' in df_app.columns: df_app['next_step_date'] = pd.to_datetime(df_app['next_step_date']).dt.strftime('%Y-%m-%d')
    # Filter out empty rows based on company
    df_app = df_app.dropna(subset=['company'])
    df_app.to_sql('job_applications', conn, if_exists='append', index=False)
    print("Applications migrated.")
except Exception as e:
    print(f"Error migrating Applications: {e}")

try:
    print("Migrating StudyLog...")
    df_study = pd.read_excel(xlsx, 'StudyLog')
    df_study = df_study.rename(columns={
        'Date': 'date', 'Topic': 'topic', 'Subtopic': 'subtopic', 'Hours': 'hours', 
        'Confidence (1-5)': 'confidence', 'SQL Solved': 'sql_solved', 
        'PySpark Solved': 'pyspark_solved', 'Resources': 'resources', 'Notes / Gaps': 'notes'
    })
    if 'date' in df_study.columns: df_study['date'] = pd.to_datetime(df_study['date']).dt.strftime('%Y-%m-%d')
    df_study = df_study.dropna(subset=['topic'])
    df_study.to_sql('study_log', conn, if_exists='append', index=False)
    print("StudyLog migrated.")
except Exception as e:
    print(f"Error migrating StudyLog: {e}")

try:
    print("Migrating Mocks...")
    df_mocks = pd.read_excel(xlsx, 'Mocks')
    df_mocks = df_mocks.rename(columns={
        'Date': 'date', 'Type': 'type', 'Platform/Partner': 'platform', 
        'Score (1-5)': 'score', 'Strengths': 'strengths', 
        'Weak Areas': 'weak_areas', 'Action Items': 'action_items'
    })
    if 'date' in df_mocks.columns: df_mocks['date'] = pd.to_datetime(df_mocks['date']).dt.strftime('%Y-%m-%d')
    df_mocks = df_mocks.dropna(subset=['type'])
    df_mocks.to_sql('mock_interviews', conn, if_exists='append', index=False)
    print("Mocks migrated.")
except Exception as e:
    print(f"Error migrating Mocks: {e}")

conn.close()
print("Migration completed.")
