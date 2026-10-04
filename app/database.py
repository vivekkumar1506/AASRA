import logging
from sqlalchemy import create_engine, event, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from .config import settings

logger = logging.getLogger("aasra.database")
logging.basicConfig(level=logging.INFO)

active_db_type = "sqlite"

def get_engine():
    global active_db_type
    mode = (settings.db_type or "auto").lower()

    if mode == "sqlite":
        logger.info("Using SQLite database (%s)", settings.sqlite_url)
        active_db_type = "sqlite"
        return create_engine(settings.sqlite_url, connect_args={"check_same_thread": False})

    if mode == "mysql":
        logger.info("Connecting directly to MySQL database (%s:%s/%s)...", settings.db_host, settings.db_port, settings.db_name)
        active_db_type = "mysql"
        return create_engine(settings.mysql_url, pool_pre_ping=True)

    # Auto mode: attempt MySQL, fallback to SQLite if connection fails
    try:
        logger.info("Auto-detecting database: testing MySQL connection at %s:%s/%s...", settings.db_host, settings.db_port, settings.db_name)
        temp_engine = create_engine(settings.mysql_url, pool_pre_ping=True, connect_args={"connect_timeout": 3})
        with temp_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("MySQL connection established successfully! Using MySQL.")
        active_db_type = "mysql"
        return temp_engine
    except Exception as exc:
        logger.warning("MySQL connection not ready (%s). Seamlessly falling back to local SQLite database: %s", exc, settings.sqlite_url)
        active_db_type = "sqlite"
        return create_engine(settings.sqlite_url, connect_args={"check_same_thread": False})


engine = get_engine()

@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    # Enable foreign keys for SQLite
    try:
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()
    except Exception:
        pass


SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
