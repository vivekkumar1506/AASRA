from urllib.parse import quote_plus
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    db_type: str = "auto"  # 'auto', 'mysql', or 'sqlite'
    db_user: str = "root"
    db_password: str = ""
    db_host: str = "localhost"
    db_port: int = 3306
    db_name: str = "aasra_db"
    database_url_override: Optional[str] = None
    secret_key: str = "aasra-secret-key-super-secure-production-ready"
    access_token_expire_minutes: int = 1440

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def mysql_url(self) -> str:
        user = quote_plus(self.db_user)
        pwd = quote_plus(self.db_password)
        return f"mysql+pymysql://{user}:{pwd}@{self.db_host}:{self.db_port}/{self.db_name}"

    @property
    def sqlite_url(self) -> str:
        return "sqlite:///./aasra_fullstack.db"

    @property
    def database_url(self) -> str:
        if self.database_url_override:
            return self.database_url_override
        if self.db_type.lower() == "sqlite":
            return self.sqlite_url
        return self.mysql_url


settings = Settings()
