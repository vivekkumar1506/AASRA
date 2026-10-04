import json
import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import select

from .database import Base, engine, SessionLocal, active_db_type
from .models import Application, Category, ChildProfile, Entry, User
from .routers import applications, auth, categories, children, counseling, entries, stats, chat
from .security import hash_password

BASE_DIR = Path(__file__).resolve().parent.parent


def seed_database():
    with SessionLocal() as db:
        # 1. Seed Categories
        if not db.scalar(select(Category)):
            default_categories = [
                Category(name="CARA Compliance", description="Statutory Central Adoption Resource Authority requirements"),
                Category(name="Home Study Report", description="Social worker home environment and parenting readiness assessment"),
                Category(name="Documentation & KYC", description="Aadhaar, PAN, Marriage certificate and financial credentials"),
                Category(name="Special Healthcare Needs", description="Guidance and protocols for specialized child care placements"),
                Category(name="Post-Adoption Followup", description="Periodic reporting and welfare visits post legal order"),
            ]
            db.add_all(default_categories)
            db.commit()

        # 2. Seed Default Admin / Demo User if none exists
        if not db.scalar(select(User)):
            demo_user = User(
                username="demo_parent",
                email="parent@aasra.org",
                full_name="Priya & Rahul Sharma",
                phone="9811234567",
                city="New Delhi",
                role="Prospective Adoptive Parent",
                hashed_password=hash_password("aasra123"),
            )
            db.add(demo_user)
            db.commit()

        # 3. Seed Demo Application
        if not db.scalar(select(Application)):
            demo_history = [
                {"title": "Application Logged", "time": "Yesterday 10:15 AM", "done": True, "desc": "Online appointment request recorded on Aasra portal."},
                {"title": "SAA Officer Assigned", "time": "Yesterday 02:30 PM", "done": True, "desc": "Coordinator Ms. Sunita Verma assigned to case."},
                {"title": "In-Person Slot Confirmed", "time": "Upcoming • Morning (10:30 AM - 12:30 PM)", "done": True, "current": True, "desc": "Appointment verified. Please report at reception."},
                {"title": "Document Physical Verification", "time": "Day of Visit", "done": False, "desc": "Physical check of KYC, marriage, and income credentials."},
                {"title": "CARINGS Official Registration", "time": "Post Consultation", "done": False, "desc": "Assistance with formal upload on cara.wcd.gov.in."}
            ]
            demo_app = Application(
                tracking_id="AASRA-DL-78241",
                agency_id="saa-delhi-palna",
                agency_name="Palna - Delhi Council for Child Welfare",
                agency_location="Civil Lines, Delhi",
                agency_phone="+91 11 2396 8907",
                agency_address="Qudsia Bagh, Shamnath Marg, Civil Lines, Delhi 110054",
                parent_name="Priya & Rahul Sharma",
                co_applicant_name="Rahul Sharma",
                phone="9811234567",
                email="priya.sharma@example.com",
                city="New Delhi",
                marital_status="Married (>2 Years)",
                purpose="Initial Adoption Guidance & Eligibility Briefing",
                appointment_date="2026-10-15",
                time_slot="Morning (10:30 AM - 12:30 PM)",
                notes="Looking to understand process for infant girl adoption under CARA guidelines.",
                status="Confirmed & Scheduled",
                current_stage=3,
                history_json=json.dumps(demo_history),
            )
            db.add(demo_app)
            db.commit()

        # 4. Seed Child Discovery Profiles
        if not db.scalar(select(ChildProfile)):
            child_profiles = [
                ChildProfile(
                    name="Infants & Early Babes",
                    category_tag="infant",
                    age_group="0 - 2 Years",
                    short_desc="Early formative phase characterized by rapid sensory and emotional attachment development. High demand in prospective parent queues.",
                    developmental_needs="Close physical holding, responsive feeding routines, sleep cycle regulation, and regular pediatric immunizations.",
                    parental_readiness="High time commitment, parental leave readiness, pediatric emergency network setup, babyproofing living spaces.",
                    bonding_advice="Skin-to-skin contact, gentle humming, and predictable feeding cycles foster immediate primal security and emotional safety.",
                    special_notice="Infant adoptions typically have a 2.5 to 3.5 year queue nationwide due to high domestic demand.",
                    adoption_status="Available"
                ),
                ChildProfile(
                    name="Toddlers & Active Explorers",
                    category_tag="toddler",
                    age_group="2 - 4 Years",
                    short_desc="Curious, energetic toddlers mastering language, autonomy, and gross motor skills. Transitioning from institutional or foster care.",
                    developmental_needs="Structured daily rhythms, language exposure, sensory play, emotional co-regulation during tantrums and adjustments.",
                    parental_readiness="Childproofing against active climbers, patience with food preferences, understanding separation anxiety.",
                    bonding_advice="Engage through interactive play, reading tactile storybooks together, and allowing the child to carry a comfort toy or blanket from the agency.",
                    special_notice="Queue duration is moderately faster (approx 1.5 to 2.5 years).",
                    adoption_status="Available"
                ),
                ChildProfile(
                    name="Young School-Age Children",
                    category_tag="child",
                    age_group="4 - 8 Years",
                    short_desc="Children with emerging individual personalities, memories, and established communication skills seeking permanent family roots.",
                    developmental_needs="School transition support, reassurance regarding permanence, social peer play, emotional validation.",
                    parental_readiness="Openness to life-story exploration, school enrollment readiness, non-punitive gentle discipline methods.",
                    bonding_advice="Cook together, establish bedtime reading rituals, and create a shared family photo album celebrating their entry into the home.",
                    special_notice="Referrals in this age bracket occur within 6 to 18 months, offering faster placement.",
                    adoption_status="Available"
                ),
                ChildProfile(
                    name="Older Children & Pre-Teens",
                    category_tag="older",
                    age_group="8+ Years",
                    short_desc="Thoughtful young people who actively participate in their adoption consent. High capability for profound mutual loyalty and loving companionship.",
                    developmental_needs="Autonomy respect, emotional trust repair, educational bridging, hobby encouragement, active listening.",
                    parental_readiness="Patience with protective emotional walls, respecting past memories, mentorship-oriented parenting style.",
                    bonding_advice="Never rush attachment; respect their pace. Focus on joint hobbies, music, sports, and unconditional emotional consistency.",
                    special_notice="Immediate priority matching available. Children aged 8+ give their personal consent during adoption hearings.",
                    adoption_status="Available"
                ),
                ChildProfile(
                    name="Sibling Duos & Trios",
                    category_tag="siblings",
                    age_group="Mixed Ages",
                    short_desc="Brothers and sisters who share an irreplaceable lifetime bond. Priority is legally given to keep biological siblings together in one loving home.",
                    developmental_needs="Preserving brother-sister emotional safety, shared yet individualized attention, distinct personal spaces.",
                    parental_readiness="Larger home capacity, financial stability for multiple children, conflict-resolution empathy.",
                    bonding_advice="Celebrate their existing sibling bond rather than competing with it. Schedule both joint family rituals and special 1-on-1 moments with each child.",
                    special_notice="Sibling placements receive expedited CARINGS priority to prevent traumatic family separation.",
                    adoption_status="Available"
                ),
                ChildProfile(
                    name="Special Healthcare & Developmental Needs",
                    category_tag="special",
                    age_group="All Ages",
                    short_desc="Remarkable children with correctable or manageable medical conditions (e.g. cleft palate, clubfoot, congenital cardiac, hearing or vision needs, developmental delays).",
                    developmental_needs="Specialized healthcare access, speech or occupational therapy, pediatric specialist appointments, assistive care.",
                    parental_readiness="Comprehensive health insurance, proximity to tertiary hospitals, emotional resilience and advocacy.",
                    bonding_advice="Focus on celebrating every small developmental milestone. Connect with specialized parent support groups and medical allies.",
                    special_notice="Immediate referral portal access (Immediate Placement / Special Needs category) with dedicated fast-track processing.",
                    adoption_status="Available"
                )
            ]
            db.add_all(child_profiles)
            db.commit()


# Ensure tables and seed data exist immediately
try:
    Base.metadata.create_all(bind=engine)
    seed_database()
except Exception as e:
    print(f"[AASRA Warning] Init DB: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield


app = FastAPI(
    title="AASRA Full Stack Platform",
    description="Aasra Child Care Discovery, Adoption Guidance & Appointment Tracking Backend API",
    version="2.0.0",
    lifespan=lifespan
)

# CORS Configuration: allow frontend from any origin / port (e.g. 5500, 3000, 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers under /api (and alias root for convenience)
for router in [
    auth.router,
    applications.router,
    counseling.router,
    children.router,
    categories.router,
    entries.router,
    stats.router,
    chat.router,
]:
    app.include_router(router, prefix="/api")
    app.include_router(router)  # Direct access support without /api prefix


@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "AASRA Full Stack Backend",
        "active_database": active_db_type,
        "docs_url": "/docs"
    }


# Mount static assets if directories exist
css_dir = BASE_DIR / "css"
js_dir = BASE_DIR / "js"
assets_dir = BASE_DIR / "assets"

if css_dir.exists():
    app.mount("/css", StaticFiles(directory=str(css_dir)), name="css")
if js_dir.exists():
    app.mount("/js", StaticFiles(directory=str(js_dir)), name="js")
if assets_dir.exists():
    app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")


# Serve the main Single-Page App at root
@app.api_route("/", methods=["GET", "HEAD"], tags=["Frontend"])
def serve_index():
    index_file = BASE_DIR / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    return {"message": "AASRA backend is running. Open /docs for API documentation."}
