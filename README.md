# AASRA — Full Stack Adoption Guidance & Child Care Discovery Platform

A full-stack web platform built with **HTML/CSS/JS frontend**, **FastAPI Python backend**, and **Multi-Database Support (MySQL + SQLite Auto-Fallback)**.

---

## 🚀 Quick Start (One-Click)

Just double-click **start.bat** on your Desktop:
`at
start.bat
`
This automatically:
1. Detects Python and the virtual environment (env).
2. Installs dependencies if needed (astapi, uvicorn, sqlalchemy, etc.).
3. Initializes database tables and seed data automatically.
4. Starts the unified server and launches your browser at **http://localhost:8000**.

---

## 🗄️ Database Architecture

The backend features an **auto-detecting dual database engine**:
- **Automatic Fallback (Zero Config)**: If MySQL is not configured or offline, it automatically runs on a local SQLite database (asra_fullstack.db).
- **MySQL Integration**: To use MySQL Server:
  1. Open .env
  2. Set your MySQL credentials:
     `env
     DB_TYPE=mysql
     DB_USER=root
     DB_PASSWORD=your_mysql_password
     DB_HOST=localhost
     DB_PORT=3306
     DB_NAME=aasra_db
     `
  3. Start the server — it connects directly to MySQL and auto-creates all tables.

---

## 🌐 Full Stack Architecture & Endpoints

| Area | Route / File | Description |
|---|---|---|
| **Frontend Portal** | http://localhost:8000/ | Interactive Adoption Platform (index.html) |
| **API Documentation** | http://localhost:8000/docs | Interactive Swagger API playground |
| **Health Check** | GET /api/health | Service & active database status |
| **Auth Register** | POST /api/auth/register | Register parent account in database |
| **Auth Login** | POST /api/auth/login | Login with email & password (JWT) |
| **Appointments & Tracking** | GET / POST / DELETE /api/applications | Book agency slots & track status live |
| **Counseling Sessions** | POST /api/counseling | Confidential guidance session requests |
| **Child Care Discovery** | GET /api/children | Age-based categories & care guidelines |
| **Power BI / Analytics** | GET /api/stats/summary | Real-time counts, status breakdown |

---

## 📁 Key File Modifications

1. [app/main.py](file:///C:/Users/vivek%20kumar/Desktop/AASRA/app/main.py): Unified FastAPI app serving REST APIs and static frontend SPA together.
2. [app/database.py](file:///C:/Users/vivek%20kumar/Desktop/AASRA/app/database.py): Resilient multi-engine database layer with automatic MySQL detection & SQLite fallback.
3. [app/models.py](file:///C:/Users/vivek%20kumar/Desktop/AASRA/app/models.py): Complete relational schema for Users, Applications, Counseling, Categories, and Child Profiles.
4. [app/routers/](file:///C:/Users/vivek%20kumar/Desktop/AASRA/app/routers/): Specialized routers for auth, appointments, counseling, child discovery, entries, and stats.
5. [js/api-config.js](file:///C:/Users/vivek%20kumar/Desktop/AASRA/js/api-config.js): Shared frontend API client connecting UI to backend with live server health indicator.
6. [js/auth-gateway.js](file:///C:/Users/vivek%20kumar/Desktop/AASRA/js/auth-gateway.js): Fixed endpoints to register and login through the database API.
7. [js/appointment-tracker.js](file:///C:/Users/vivek%20kumar/Desktop/AASRA/js/appointment-tracker.js): Stores appointment bookings into the database and syncs tracking lookups.
8. [js/app.js](file:///C:/Users/vivek%20kumar/Desktop/AASRA/js/app.js): Counseling session bookings sync to the database.
9. [start.bat](file:///C:/Users/vivek%20kumar/Desktop/AASRA/start.bat): One-click starter script for the full stack server.
