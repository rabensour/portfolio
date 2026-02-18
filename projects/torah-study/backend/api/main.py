from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import search, texts, health
from src.config import get_settings

settings = get_settings()

app = FastAPI(
    title="Torah Study API",
    description="API for studying Jewish texts with guaranteed source accuracy",
    version="1.0.0",
    debug=settings.debug,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(search.router, prefix="/api", tags=["search"])
app.include_router(texts.router, prefix="/api", tags=["texts"])


@app.get("/")
async def root():
    return {
        "message": "Torah Study API",
        "version": "1.0.0",
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "api.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
    )
