from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    AP1_V1_STR: str = '/api/v1'
    PROJECT_NAME: str = 'Seismic Monitor'

    POSTGRES_SERVER: str = 'db'
    POSTGRES_USER: str = 'user'
    POSTGRES_PASSWORD: str = 'password'
    POSTGRES_DB: str = 'seismic_db'
    DATABASE_PORT: str = '5433'

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.DATABASE_PORT}/{self.POSTGRES_DB}"
    
    class Config:
        case_sensitive = True

settings = Settings()