# app/routers/api.py
import os
from pathlib import Path
from typing import Any, Dict, List

from app.models.repo import RepoInput
from app.services.git_service import GitService
from app.services.rag_service import RAGService
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1", tags=["repositories"])


# Pydantic models for request/response
class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str
    sources: List[Dict[str, Any]]
    repo_id: str


def get_git_service() -> GitService:
    """Dependency to get GitService instance with configuration."""
    max_repo_size_mb = int(os.getenv("MAX_REPO_SIZE_MB", "100"))
    return GitService(max_repo_size_mb=max_repo_size_mb)


def get_rag_service() -> RAGService:
    """Dependency to get RAGService instance."""
    return RAGService()


@router.post("/repos/clone", response_model=Dict[str, str])
async def clone_repository(
    repo_input: RepoInput, git_service: GitService = Depends(get_git_service)
) -> Dict[str, str]:
    """
    Clone a GitHub repository.

    Args:
        repo_input: Repository input containing the GitHub URL
        git_service: GitService dependency for cloning operations

    Returns:
        Dictionary containing the repository ID and status

    Raises:
        HTTPException: If the repository URL is invalid, cloning fails,
                      or repository exceeds size limits
    """
    try:
        repo_id = git_service.clone_repository(str(repo_input.url))
        return {
            "repo_id": repo_id,
            "status": "cloned",
            "message": f"Repository successfully cloned with ID: {repo_id}",
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error during repository cloning: {str(e)}",
        )


@router.post("/repos/{repo_id}/process", response_model=Dict[str, Any])
async def process_repository(
    repo_id: str, rag_service: RAGService = Depends(get_rag_service)
) -> Dict[str, Any]:
    """
    Process a cloned repository for RAG (create embeddings).

    Args:
        repo_id: The repository identifier
        rag_service: RAGService dependency for processing

    Returns:
        Dictionary containing processing status and statistics

    Raises:
        HTTPException: If repository is not found or processing fails
    """
    try:
        result = rag_service.process_repository(repo_id)
        return result
    except FileNotFoundError:
        raise HTTPException(
            status_code=404, detail=f"Repository with ID '{repo_id}' not found"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing repository: {str(e)}"
        )


@router.post("/repos/{repo_id}/chat", response_model=ChatResponse)
async def chat_with_repository(
    repo_id: str,
    chat_request: ChatRequest,
    rag_service: RAGService = Depends(get_rag_service),
) -> ChatResponse:
    """
    Chat with a processed repository using RAG.

    Args:
        repo_id: The repository identifier
        chat_request: The chat request containing the question
        rag_service: RAGService dependency for chat operations

    Returns:
        ChatResponse containing the answer and sources

    Raises:
        HTTPException: If repository is not found, not processed, or chat fails
    """
    try:
        # Check if repository is processed
        status = rag_service.get_repository_status(repo_id)
        if not status["processed"]:
            raise HTTPException(
                status_code=400,
                detail=f"Repository '{repo_id}' has not been processed for RAG. Please process it first.",
            )

        result = rag_service.chat_with_repository(repo_id, chat_request.question)
        return ChatResponse(**result)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error chatting with repository: {str(e)}"
        )


@router.get("/repos/{repo_id}/status", response_model=Dict[str, Any])
async def get_repository_status(
    repo_id: str, rag_service: RAGService = Depends(get_rag_service)
) -> Dict[str, Any]:
    """
    Get the processing status of a repository.

    Args:
        repo_id: The repository identifier
        rag_service: RAGService dependency

    Returns:
        Dictionary containing processing status and metadata
    """
    try:
        rag_status = rag_service.get_repository_status(repo_id)

        # Also get basic repo info
        repo_path = Path("repos") / repo_id
        if repo_path.exists():
            repo_size = sum(f.stat().st_size for f in repo_path.rglob("*")) / (
                1024 * 1024
            )
            file_count = len(list(repo_path.rglob("*")))

            return {
                **rag_status,
                "repo_exists": True,
                "repo_size_mb": round(repo_size, 2),
                "total_files": file_count,
            }
        else:
            return {**rag_status, "repo_exists": False}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error getting repository status: {str(e)}"
        )


@router.get("/repos", response_model=List[Dict[str, Any]])
async def list_repositories() -> List[Dict[str, Any]]:
    """
    List all cloned repositories.

    Returns:
        List of dictionaries containing repository information including
        repo_id, path, and basic metadata
    """
    repos_dir = Path("repos")
    repositories = []

    if not repos_dir.exists():
        return repositories

    for repo_path in repos_dir.iterdir():
        if repo_path.is_dir():
            repo_size = sum(f.stat().st_size for f in repo_path.rglob("*")) / (
                1024 * 1024
            )
            repositories.append(
                {
                    "repo_id": repo_path.name,
                    "path": str(repo_path),
                    "size_mb": round(repo_size, 2),
                }
            )

    return repositories


@router.get("/repos/{repo_id}", response_model=Dict[str, Any])
async def get_repository_info(repo_id: str) -> Dict[str, Any]:
    """
    Get information about a specific cloned repository.

    Args:
        repo_id: The repository identifier

    Returns:
        Dictionary containing detailed repository information

    Raises:
        HTTPException: If repository is not found
    """
    repo_path = Path("repos") / repo_id

    if not repo_path.exists():
        raise HTTPException(
            status_code=404, detail=f"Repository with ID '{repo_id}' not found"
        )

    repo_size = sum(f.stat().st_size for f in repo_path.rglob("*")) / (1024 * 1024)
    file_count = len(list(repo_path.rglob("*")))

    return {
        "repo_id": repo_id,
        "path": str(repo_path),
        "size_mb": round(repo_size, 2),
        "file_count": file_count,
        "exists": True,
    }


@router.delete("/repos/{repo_id}", response_model=Dict[str, str])
async def delete_repository(repo_id: str) -> Dict[str, str]:
    """
    Delete a cloned repository.

    Args:
        repo_id: The repository identifier to delete

    Returns:
        Dictionary containing deletion status

    Raises:
        HTTPException: If repository is not found or deletion fails
    """
    repo_path = Path("repos") / repo_id

    if not repo_path.exists():
        raise HTTPException(
            status_code=404, detail=f"Repository with ID '{repo_id}' not found"
        )

    try:
        import shutil

        shutil.rmtree(repo_path)
        return {
            "repo_id": repo_id,
            "status": "deleted",
            "message": f"Repository '{repo_id}' successfully deleted",
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to delete repository: {str(e)}"
        )

