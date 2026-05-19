from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from .models import (
    get_db, DailyPlan, JobApplication, StudyLog, MockInterview,
    ProjectMilestone, QuestionBank, Offer, Reminder, TargetCompany
)
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import date

router = APIRouter()

# ============================================================
# Pydantic Schemas
# ============================================================

# --- DailyPlan ---
class DailyPlanCreate(BaseModel):
    day: int
    date: date
    week: str
    focus_area: str
    tasks: str
    hours_planned: float
    status: str
    hours_actual: Optional[float] = None
    notes: Optional[str] = None
    ai_guide: Optional[str] = None

class DailyPlanOut(DailyPlanCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


# --- JobApplication ---
class JobApplicationCreate(BaseModel):
    date_applied: date
    company: str
    role: str
    location: str
    source: str
    job_link: Optional[str] = None
    referral: Optional[str] = None
    status: str
    recruiter_contact: Optional[str] = None
    next_step: Optional[str] = None
    next_step_date: Optional[date] = None
    notes: Optional[str] = None

class JobApplicationOut(JobApplicationCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


# --- StudyLog ---
class StudyLogCreate(BaseModel):
    date: date
    topic: str
    subtopic: Optional[str] = None
    hours: Optional[float] = None
    confidence: Optional[int] = None
    sql_solved: Optional[int] = None
    pyspark_solved: Optional[int] = None
    resources: Optional[str] = None
    notes: Optional[str] = None

class StudyLogOut(StudyLogCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


# --- MockInterview ---
class MockInterviewCreate(BaseModel):
    date: date
    type: str
    platform: Optional[str] = None
    score: Optional[int] = None
    strengths: Optional[str] = None
    weak_areas: Optional[str] = None
    action_items: Optional[str] = None

class MockInterviewOut(MockInterviewCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


# --- ProjectMilestone ---
class ProjectMilestoneCreate(BaseModel):
    project: str
    milestone: str
    owner: Optional[str] = None
    due_date: Optional[date] = None
    status: str
    github_url: Optional[str] = None
    notes: Optional[str] = None

class ProjectMilestoneOut(ProjectMilestoneCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


# --- QuestionBank ---
class QuestionBankCreate(BaseModel):
    topic: str
    question: str
    difficulty: str
    answer: Optional[str] = None
    confidence: Optional[int] = None
    last_revised: Optional[date] = None

class QuestionBankOut(QuestionBankCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


# --- Offer ---
class OfferCreate(BaseModel):
    company: str
    role: str
    ctc: float
    base: float
    bonus: float
    stocks: float
    benefits: Optional[str] = None
    notes: Optional[str] = None
    status: str

class OfferOut(OfferCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


# --- Reminder ---
class ReminderCreate(BaseModel):
    title: str
    due_date: date
    completed: Optional[bool] = False
    notes: Optional[str] = None

class ReminderOut(ReminderCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


# --- TargetCompany ---
class TargetCompanyCreate(BaseModel):
    company: str
    tier: Optional[str] = None
    role: Optional[str] = None
    why_it_fits: Optional[str] = None
    referral_contact: Optional[str] = None
    status: Optional[str] = None

class TargetCompanyOut(TargetCompanyCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


# ============================================================
# CRUD Endpoints — DailyPlan
# ============================================================
@router.post("/dailyplan/", response_model=DailyPlanOut)
def create_daily_plan(plan: DailyPlanCreate, db: Session = Depends(get_db)):
    db_plan = DailyPlan(**plan.model_dump())
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan

@router.get("/dailyplan/", response_model=List[DailyPlanOut])
def get_daily_plans(db: Session = Depends(get_db)):
    return db.query(DailyPlan).all()

@router.get("/dailyplan/{plan_id}", response_model=DailyPlanOut)
def get_daily_plan(plan_id: int, db: Session = Depends(get_db)):
    plan = db.query(DailyPlan).filter(DailyPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan

@router.put("/dailyplan/{plan_id}", response_model=DailyPlanOut)
def update_daily_plan(plan_id: int, plan: DailyPlanCreate, db: Session = Depends(get_db)):
    db_plan = db.query(DailyPlan).filter(DailyPlan.id == plan_id).first()
    if not db_plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    for k, v in plan.model_dump().items():
        setattr(db_plan, k, v)
    db.commit()
    db.refresh(db_plan)
    return db_plan

@router.delete("/dailyplan/{plan_id}")
def delete_daily_plan(plan_id: int, db: Session = Depends(get_db)):
    db_plan = db.query(DailyPlan).filter(DailyPlan.id == plan_id).first()
    if not db_plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    db.delete(db_plan)
    db.commit()
    return {"ok": True}


# ============================================================
# CRUD Endpoints — JobApplication
# ============================================================
@router.post("/jobapps/", response_model=JobApplicationOut)
def create_job_app(app: JobApplicationCreate, db: Session = Depends(get_db)):
    db_app = JobApplication(**app.model_dump())
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

@router.get("/jobapps/", response_model=List[JobApplicationOut])
def get_job_apps(db: Session = Depends(get_db)):
    return db.query(JobApplication).all()

@router.get("/jobapps/{app_id}", response_model=JobApplicationOut)
def get_job_app(app_id: int, db: Session = Depends(get_db)):
    app = db.query(JobApplication).filter(JobApplication.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app

@router.put("/jobapps/{app_id}", response_model=JobApplicationOut)
def update_job_app(app_id: int, app: JobApplicationCreate, db: Session = Depends(get_db)):
    db_app = db.query(JobApplication).filter(JobApplication.id == app_id).first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Application not found")
    for k, v in app.model_dump().items():
        setattr(db_app, k, v)
    db.commit()
    db.refresh(db_app)
    return db_app

@router.delete("/jobapps/{app_id}")
def delete_job_app(app_id: int, db: Session = Depends(get_db)):
    db_app = db.query(JobApplication).filter(JobApplication.id == app_id).first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(db_app)
    db.commit()
    return {"ok": True}


# ============================================================
# CRUD Endpoints — StudyLog
# ============================================================
@router.post("/studylogs/", response_model=StudyLogOut)
def create_study_log(log: StudyLogCreate, db: Session = Depends(get_db)):
    db_log = StudyLog(**log.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

@router.get("/studylogs/", response_model=List[StudyLogOut])
def get_study_logs(db: Session = Depends(get_db)):
    return db.query(StudyLog).all()

@router.get("/studylogs/{log_id}", response_model=StudyLogOut)
def get_study_log(log_id: int, db: Session = Depends(get_db)):
    log = db.query(StudyLog).filter(StudyLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Study log not found")
    return log

@router.put("/studylogs/{log_id}", response_model=StudyLogOut)
def update_study_log(log_id: int, log: StudyLogCreate, db: Session = Depends(get_db)):
    db_log = db.query(StudyLog).filter(StudyLog.id == log_id).first()
    if not db_log:
        raise HTTPException(status_code=404, detail="Study log not found")
    for k, v in log.model_dump().items():
        setattr(db_log, k, v)
    db.commit()
    db.refresh(db_log)
    return db_log

@router.delete("/studylogs/{log_id}")
def delete_study_log(log_id: int, db: Session = Depends(get_db)):
    db_log = db.query(StudyLog).filter(StudyLog.id == log_id).first()
    if not db_log:
        raise HTTPException(status_code=404, detail="Study log not found")
    db.delete(db_log)
    db.commit()
    return {"ok": True}


# ============================================================
# CRUD Endpoints — MockInterview
# ============================================================
@router.post("/mockinterviews/", response_model=MockInterviewOut)
def create_mock_interview(interview: MockInterviewCreate, db: Session = Depends(get_db)):
    db_interview = MockInterview(**interview.model_dump())
    db.add(db_interview)
    db.commit()
    db.refresh(db_interview)
    return db_interview

@router.get("/mockinterviews/", response_model=List[MockInterviewOut])
def get_mock_interviews(db: Session = Depends(get_db)):
    return db.query(MockInterview).all()

@router.get("/mockinterviews/{interview_id}", response_model=MockInterviewOut)
def get_mock_interview(interview_id: int, db: Session = Depends(get_db)):
    interview = db.query(MockInterview).filter(MockInterview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Mock interview not found")
    return interview

@router.put("/mockinterviews/{interview_id}", response_model=MockInterviewOut)
def update_mock_interview(interview_id: int, interview: MockInterviewCreate, db: Session = Depends(get_db)):
    db_interview = db.query(MockInterview).filter(MockInterview.id == interview_id).first()
    if not db_interview:
        raise HTTPException(status_code=404, detail="Mock interview not found")
    for k, v in interview.model_dump().items():
        setattr(db_interview, k, v)
    db.commit()
    db.refresh(db_interview)
    return db_interview

@router.delete("/mockinterviews/{interview_id}")
def delete_mock_interview(interview_id: int, db: Session = Depends(get_db)):
    db_interview = db.query(MockInterview).filter(MockInterview.id == interview_id).first()
    if not db_interview:
        raise HTTPException(status_code=404, detail="Mock interview not found")
    db.delete(db_interview)
    db.commit()
    return {"ok": True}


# ============================================================
# CRUD Endpoints — ProjectMilestone
# ============================================================
@router.post("/milestones/", response_model=ProjectMilestoneOut)
def create_milestone(milestone: ProjectMilestoneCreate, db: Session = Depends(get_db)):
    db_milestone = ProjectMilestone(**milestone.model_dump())
    db.add(db_milestone)
    db.commit()
    db.refresh(db_milestone)
    return db_milestone

@router.get("/milestones/", response_model=List[ProjectMilestoneOut])
def get_milestones(db: Session = Depends(get_db)):
    return db.query(ProjectMilestone).all()

@router.get("/milestones/{milestone_id}", response_model=ProjectMilestoneOut)
def get_milestone(milestone_id: int, db: Session = Depends(get_db)):
    milestone = db.query(ProjectMilestone).filter(ProjectMilestone.id == milestone_id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    return milestone

@router.put("/milestones/{milestone_id}", response_model=ProjectMilestoneOut)
def update_milestone(milestone_id: int, milestone: ProjectMilestoneCreate, db: Session = Depends(get_db)):
    db_milestone = db.query(ProjectMilestone).filter(ProjectMilestone.id == milestone_id).first()
    if not db_milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    for k, v in milestone.model_dump().items():
        setattr(db_milestone, k, v)
    db.commit()
    db.refresh(db_milestone)
    return db_milestone

@router.delete("/milestones/{milestone_id}")
def delete_milestone(milestone_id: int, db: Session = Depends(get_db)):
    db_milestone = db.query(ProjectMilestone).filter(ProjectMilestone.id == milestone_id).first()
    if not db_milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    db.delete(db_milestone)
    db.commit()
    return {"ok": True}


# ============================================================
# CRUD Endpoints — QuestionBank
# ============================================================
@router.post("/questions/", response_model=QuestionBankOut)
def create_question(question: QuestionBankCreate, db: Session = Depends(get_db)):
    db_question = QuestionBank(**question.model_dump())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

@router.get("/questions/", response_model=List[QuestionBankOut])
def get_questions(db: Session = Depends(get_db)):
    return db.query(QuestionBank).all()

@router.get("/questions/{question_id}", response_model=QuestionBankOut)
def get_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(QuestionBank).filter(QuestionBank.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@router.put("/questions/{question_id}", response_model=QuestionBankOut)
def update_question(question_id: int, question: QuestionBankCreate, db: Session = Depends(get_db)):
    db_question = db.query(QuestionBank).filter(QuestionBank.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    for k, v in question.model_dump().items():
        setattr(db_question, k, v)
    db.commit()
    db.refresh(db_question)
    return db_question

@router.delete("/questions/{question_id}")
def delete_question(question_id: int, db: Session = Depends(get_db)):
    db_question = db.query(QuestionBank).filter(QuestionBank.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    db.delete(db_question)
    db.commit()
    return {"ok": True}


# ============================================================
# CRUD Endpoints — Offer
# ============================================================
@router.post("/offers/", response_model=OfferOut)
def create_offer(offer: OfferCreate, db: Session = Depends(get_db)):
    db_offer = Offer(**offer.model_dump())
    db.add(db_offer)
    db.commit()
    db.refresh(db_offer)
    return db_offer

@router.get("/offers/", response_model=List[OfferOut])
def get_offers(db: Session = Depends(get_db)):
    return db.query(Offer).all()

@router.get("/offers/{offer_id}", response_model=OfferOut)
def get_offer(offer_id: int, db: Session = Depends(get_db)):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    return offer

@router.put("/offers/{offer_id}", response_model=OfferOut)
def update_offer(offer_id: int, offer: OfferCreate, db: Session = Depends(get_db)):
    db_offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not db_offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    for k, v in offer.model_dump().items():
        setattr(db_offer, k, v)
    db.commit()
    db.refresh(db_offer)
    return db_offer

@router.delete("/offers/{offer_id}")
def delete_offer(offer_id: int, db: Session = Depends(get_db)):
    db_offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not db_offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    db.delete(db_offer)
    db.commit()
    return {"ok": True}


# ============================================================
# CRUD Endpoints — Reminder
# ============================================================
@router.post("/reminders/", response_model=ReminderOut)
def create_reminder(reminder: ReminderCreate, db: Session = Depends(get_db)):
    db_reminder = Reminder(**reminder.model_dump())
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    return db_reminder

@router.get("/reminders/", response_model=List[ReminderOut])
def get_reminders(db: Session = Depends(get_db)):
    return db.query(Reminder).all()

@router.get("/reminders/{reminder_id}", response_model=ReminderOut)
def get_reminder(reminder_id: int, db: Session = Depends(get_db)):
    reminder = db.query(Reminder).filter(Reminder.id == reminder_id).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return reminder

@router.put("/reminders/{reminder_id}", response_model=ReminderOut)
def update_reminder(reminder_id: int, reminder: ReminderCreate, db: Session = Depends(get_db)):
    db_reminder = db.query(Reminder).filter(Reminder.id == reminder_id).first()
    if not db_reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    for k, v in reminder.model_dump().items():
        setattr(db_reminder, k, v)
    db.commit()
    db.refresh(db_reminder)
    return db_reminder

@router.delete("/reminders/{reminder_id}")
def delete_reminder(reminder_id: int, db: Session = Depends(get_db)):
    db_reminder = db.query(Reminder).filter(Reminder.id == reminder_id).first()
    if not db_reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    db.delete(db_reminder)
    db.commit()
    return {"ok": True}


# ============================================================
# CRUD Endpoints — TargetCompany
# ============================================================
@router.post("/targetcompanies/", response_model=TargetCompanyOut)
def create_target_company(tc: TargetCompanyCreate, db: Session = Depends(get_db)):
    db_tc = TargetCompany(**tc.model_dump())
    db.add(db_tc)
    db.commit()
    db.refresh(db_tc)
    return db_tc

@router.get("/targetcompanies/", response_model=List[TargetCompanyOut])
def get_target_companies(db: Session = Depends(get_db)):
    return db.query(TargetCompany).all()

@router.get("/targetcompanies/{tc_id}", response_model=TargetCompanyOut)
def get_target_company(tc_id: int, db: Session = Depends(get_db)):
    tc = db.query(TargetCompany).filter(TargetCompany.id == tc_id).first()
    if not tc:
        raise HTTPException(status_code=404, detail="Target company not found")
    return tc

@router.put("/targetcompanies/{tc_id}", response_model=TargetCompanyOut)
def update_target_company(tc_id: int, tc: TargetCompanyCreate, db: Session = Depends(get_db)):
    db_tc = db.query(TargetCompany).filter(TargetCompany.id == tc_id).first()
    if not db_tc:
        raise HTTPException(status_code=404, detail="Target company not found")
    for k, v in tc.model_dump().items():
        setattr(db_tc, k, v)
    db.commit()
    db.refresh(db_tc)
    return db_tc

@router.delete("/targetcompanies/{tc_id}")
def delete_target_company(tc_id: int, db: Session = Depends(get_db)):
    db_tc = db.query(TargetCompany).filter(TargetCompany.id == tc_id).first()
    if not db_tc:
        raise HTTPException(status_code=404, detail="Target company not found")
    db.delete(db_tc)
    db.commit()
    return {"ok": True}
