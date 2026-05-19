import requests

endpoints = {
    "DailyPlan": "http://localhost:8000/dailyplan/",
    "JobApps": "http://localhost:8000/jobapps/",
    "StudyLogs": "http://localhost:8000/studylogs/",
    "MockInterviews": "http://localhost:8000/mockinterviews/",
    "Milestones": "http://localhost:8000/milestones/",
    "Questions": "http://localhost:8000/questions/",
    "Offers": "http://localhost:8000/offers/",
    "Reminders": "http://localhost:8000/reminders/",
    "TargetCompanies": "http://localhost:8000/targetcompanies/",
}

print("API Health Check")
print("=" * 50)
for name, url in endpoints.items():
    try:
        r = requests.get(url)
        data = r.json()
        status = "OK" if r.status_code == 200 else f"ERR {r.status_code}"
        print(f"  {name:20s} {status:5s}  {len(data)} rows")
    except Exception as e:
        print(f"  {name:20s} FAIL   {e}")
