import shutil
from pathlib import Path

from fastapi import HTTPException
from git import Repo


class GitService:
    def __init__(self, max_repo_size_mb: int):
        self.max_repo_size_mb = max_repo_size_mb
        self.clone_dir_base = Path("repos")

    def clone_repository(self, repo_url: str) -> str:
        """Clone a GitHub repository and return the repo ID (directory name)."""
        # Validate URL
        if not repo_url.startswith("https://github.com/"):
            raise HTTPException(
                status_code=400, detail="Only GitHub URLs are supported"
            )

        # Generate repo ID (e.g., username_repo)
        repo_id = repo_url.split("/")[-1].replace(".git", "")
        clone_path = self.clone_dir_base / repo_id

        # Clean up if directory exists
        if clone_path.exists():
            shutil.rmtree(clone_path)

        try:
            # Ensure parent directory exists
            clone_path.parent.mkdir(parents=True, exist_ok=True)
            # Clone repository
            Repo.clone_from(repo_url, clone_path)

            # Check repository size
            repo_size_mb = sum(f.stat().st_size for f in clone_path.rglob("*")) / (
                1024 * 1024
            )
            if repo_size_mb > self.max_repo_size_mb:
                shutil.rmtree(clone_path)
                raise HTTPException(
                    status_code=400, detail="Repository exceeds size limit"
                )

            return repo_id

        except HTTPException:
            # Re-raise HTTPExceptions as-is (e.g., repository size limit)
            raise
        except Exception as e:
            if clone_path.exists():
                shutil.rmtree(clone_path)
            raise HTTPException(
                status_code=500, detail=f"Failed to clone repository: {str(e)}"
            )

