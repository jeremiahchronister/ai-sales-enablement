"""
AI Sales Enablement Platform - FastAPI Backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Import routers
from app.api import leads, proposals, battlecards, conversations


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    import os
    print("🚀 AI Sales Enablement Platform starting...")

    # Validate API key
    api_key = os.getenv("ANTHROPIC_API_KEY", "")
    if not api_key or api_key.strip() == "":
        print("❌ ERROR: ANTHROPIC_API_KEY environment variable is not set!")
        print("Please set ANTHROPIC_API_KEY in your .env file")
        raise RuntimeError("Missing ANTHROPIC_API_KEY - cannot start application")
    else:
        print(f"✅ Anthropic API key configured (length: {len(api_key)} characters)")

    yield
    # Shutdown
    print("👋 Shutting down...")


app = FastAPI(
    title="AI Sales Enablement Platform",
    description="AI-powered sales tools for lead scoring, proposals, battle cards, and conversation intelligence",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "AI Sales Enablement Platform"}

# Include routers
app.include_router(leads.router, prefix="/api/leads", tags=["Lead Scoring"])
app.include_router(proposals.router, prefix="/api/proposals", tags=["Proposals"])
app.include_router(battlecards.router, prefix="/api/battlecards", tags=["Battle Cards"])
app.include_router(conversations.router, prefix="/api/conversations", tags=["Conversation Intelligence"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
