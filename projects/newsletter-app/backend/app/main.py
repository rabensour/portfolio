from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .config import settings
from .database import db
from .routes import webhook, emails


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database
    await db.create_tables()
    yield
    # Shutdown: cleanup if needed


app = FastAPI(
    title="Newsletter Email API",
    description="Backend for newsletter email web-app",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(webhook.router, prefix="/api", tags=["webhook"])
app.include_router(emails.router, prefix="/api", tags=["emails"])


@app.get("/")
async def root():
    return {"status": "ok", "message": "Newsletter Email API"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
