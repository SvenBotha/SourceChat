"""
SourceChat API - A FastAPI application for GitHub repository analysis and chat.

This application provides endpoints for cloning GitHub repositories and
performing chat-based queries on their contents using RAG (Retrieval-Augmented Generation).
"""

from app.routers import router
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI application with metadata for documentation
app = FastAPI(
    title="SourceChat API",
    description="API for cloning GitHub repositories and performing chat-based code analysis",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS middleware to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend development server
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include API router with all endpoints
app.include_router(router)


@app.get("/health", tags=["health"])
async def health_check():
    """
    Health check endpoint.

    Returns:
        dict: Status message indicating the API is healthy and operational
    """
    return {"status": "healthy"}
