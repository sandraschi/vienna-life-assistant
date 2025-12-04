"""
Vienna Life Assistant - FastAPI Backend
Main application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

# Import routers
from api.calendar.routes import router as calendar_router
from api.todos.routes import router as todos_router
from api.shopping.routes import router as shopping_router
from api.llm.routes import router as llm_router
from api.media.routes import router as media_router
from api.expenses.routes import router as expenses_router
from api.chat.routes import router as chat_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("🚀 Vienna Life Assistant starting...")
    
    # Initialize SQLite database
    print("💾 Initializing SQLite database...")
    try:
        # Import models to register them with SQLAlchemy
        from models import todo, calendar, shopping, expense, conversation
        from models.base import init_db
        init_db()
        print("✅ Database initialized")
    except Exception as e:
        print(f"⚠️  Database initialization failed: {e}")
    
    # Initialize Ollama default model
    print("🤖 Checking Ollama LLM...")
    try:
        from services.ollama_service import ollama_service
        is_connected = await ollama_service.check_connection()
        if is_connected:
            print("✅ Ollama is running")
            models = await ollama_service.list_models()
            if models:
                print(f"📦 Found {len(models)} Ollama models")
            else:
                print("⚠️  No Ollama models found. Pull one with: ollama pull llama3.2:3b")
        else:
            print("⚠️  Ollama not running (optional). Start with: ollama serve")
    except Exception as e:
        print(f"⚠️  Ollama check failed (optional): {e}")
    
    print("✨ Vienna Life Assistant ready!")
    yield
    # Shutdown
    print("👋 Vienna Life Assistant shutting down...")

app = FastAPI(
    title="Vienna Life Assistant API",
    description="Personal life management API with calendar, todos, and shopping",
    version="0.1.0",
    lifespan=lifespan
)

# CORS middleware - Updated for port 9173 and Tailscale access
origins = os.getenv("CORS_ORIGINS", "http://localhost:9173,http://localhost:5173,http://goliath:9173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "vienna-life-assistant",
        "version": "0.1.0"
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Vienna Life Assistant API",
        "docs": "/docs",
        "health": "/health"
    }

# Register routers
app.include_router(calendar_router, prefix="/api/calendar", tags=["calendar"])
app.include_router(todos_router, prefix="/api/todos", tags=["todos"])
app.include_router(shopping_router, prefix="/api/shopping", tags=["shopping"])
app.include_router(llm_router, prefix="/api/llm", tags=["llm"])
app.include_router(media_router, prefix="/api/media", tags=["media"])
app.include_router(expenses_router)
app.include_router(chat_router, prefix="/api", tags=["chat"])

