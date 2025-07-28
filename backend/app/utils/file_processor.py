import os
from pathlib import Path
from typing import List


class FileProcessor:
    def __init__(self):
        extensions_str = os.getenv(
            "SUPPORTED_EXTENSIONS",
            ".py,.js,.ts,.jsx,.tsx,.java,.cpp,.c,.h,.cs,.php,.rb,.go,.rs,.swift,.kt,.scala,.lua,.vim,.md,.txt,.yaml,.yml,.json,.xml,.html,.css,.scss,.sass,.sql",
        )
        self.supported_extensions = set(
            ext.strip() for ext in extensions_str.split(",")
        )

        # Directories to ignore
        self.ignore_dirs = {
            ".git",
            ".svn",
            ".hg",
            "node_modules",
            "__pycache__",
            ".pytest_cache",
            "venv",
            "env",
            ".env",
            "ENV",
            "build",
            "dist",
            "target",
            "out",
            ".next",
            ".nuxt",
            ".vscode",
            ".idea",
            "coverage",
            ".coverage",
            "htmlcov",
            ".tox",
            ".mypy_cache",
            "vendor",
            "logs",
            "tmp",
            "temp",
            ".tmp",
            ".DS_Store",
        }

        # Files to ignore
        self.ignore_files = {
            ".gitignore",
            ".dockerignore",
            ".env",
            ".env.example",
            "package-lock.json",
            "yarn.lock",
            "poetry.lock",
            "Cargo.lock",
            "Gemfile.lock",
            "composer.lock",
            ".DS_Store",
            "Thumbs.db",
            "desktop.ini",
        }

        # Binary file extensions to skip
        self.binary_extensions = {
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".svg",
            ".ico",
            ".pdf",
            ".zip",
            ".tar",
            ".gz",
            ".rar",
            ".7z",
            ".exe",
            ".dll",
            ".so",
            ".dylib",
            ".a",
            ".mp3",
            ".mp4",
            ".avi",
            ".mov",
            ".wmv",
            ".woff",
            ".woff2",
            ".ttf",
            ".eot",
            ".otf",
        }

    def should_process_files(self, file_path: Path) -> bool:
        """Determine if a file should be processed."""

        if file_path.name in self.ignore_files:
            return False

        if file_path.suffix.lower() in self.binary_extensions:
            return False

        if file_path.suffix.lower() not in self.supported_extensions:
            if file_path.name.upper() in [
                "README",
                "LICENSE",
                "CHANGELOG",
                "CONTRIBUTING",
            ]:
                return True
            return False

        try:
            if file_path.stat().st_size > 1024 * 1024:
                return False

        except OSError:
            return False

        return True

    def should_process_directory(self, dir_path: Path) -> bool:
        return dir_path.name not in self.ignore_dirs

    def get_code_files(self, repo_path: Path) -> List[Path]:
        code_files = []

        for root, dirs, files in os.walk(repo_path):
            root_path = Path(root)

            # Filter directories in-place to avoid walking ignored directories
            dirs[:] = [d for d in dirs if self.should_process_directory(root_path / d)]

            for file in files:
                file_path = root_path / file
                if self.should_process_files(file_path):
                    code_files.append(file_path)

        return sorted(code_files)

    def get_file_stats(self, repo_path: Path) -> dict:
        """Get statistics about files in the repository."""
        all_files = list(repo_path.rglob("*"))
        processable_files = self.get_code_files(repo_path)

        # Count by extension
        extension_counts = {}
        for file_path in processable_files:
            ext = file_path.suffix.lower() or "no_extension"
            extension_counts[ext] = extension_counts.get(ext, 0) + 1

        total_size = sum(f.stat().st_size for f in processable_files if f.is_file()) / (
            1024 * 1024
        )  # Convert to MB

        return {
            "total_files": len([f for f in all_files if f.is_file()]),
            "processable_files": len(processable_files),
            "total_size_mb": round(total_size, 2),
            "extension_counts": extension_counts,
            "supported_extensions": list(self.supported_extensions),
        }
