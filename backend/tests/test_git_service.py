from pathlib import Path

import pytest
from app.services.git_service import GitService
from fastapi import HTTPException
from git import Repo


# Fixture to initialize GitService with a test configuration
@pytest.fixture
def git_service(tmp_path, mocker):
    # Set up temporary directory for repos
    clone_dir_base = tmp_path / "repos"
    clone_dir_base.mkdir()
    # Mock the clone_dir_base property directly on GitService
    service = GitService(max_repo_size_mb=500)
    service.clone_dir_base = clone_dir_base
    return service


# Mock the Repo.clone_from method to avoid actual cloning
@pytest.fixture
def mock_repo_clone(mocker, tmp_path):
    def create_clone_dir(url, path):
        # Simulate cloning by creating the directory
        path.mkdir(parents=True, exist_ok=True)

    return mocker.patch.object(Repo, "clone_from", side_effect=create_clone_dir)


# Test successful repository cloning
def test_clone_repository_success(git_service, mock_repo_clone, tmp_path):
    repo_url = "https://github.com/python/cpython.git"
    repo_id = git_service.clone_repository(repo_url)

    assert repo_id == "cpython"
    mock_repo_clone.assert_called_once_with(repo_url, tmp_path / "repos" / "cpython")
    assert (tmp_path / "repos" / "cpython").exists()


# Test non-GitHub URL validation
def test_clone_repository_invalid_url(git_service):
    repo_url = "https://bitbucket.org/user/repo.git"
    with pytest.raises(HTTPException) as exc:
        git_service.clone_repository(repo_url)
    assert exc.value.status_code == 400
    assert "Only GitHub URLs are supported" in exc.value.detail


# Test repository size limit enforcement
def test_clone_repository_size_limit(git_service, mock_repo_clone, tmp_path, mocker):
    # Mock rglob to return a single large file
    mock_file = mocker.MagicMock()
    mock_file.stat.return_value.st_size = 600 * 1024 * 1024  # 600 MB
    mocker.patch("pathlib.Path.rglob", return_value=[mock_file])

    repo_url = "https://github.com/python/cpython.git"
    with pytest.raises(HTTPException) as exc:
        git_service.clone_repository(repo_url)
    assert exc.value.status_code == 400
    assert "Repository exceeds size limit" in exc.value.detail
    assert not (tmp_path / "repos" / "cpython").exists()  # Ensure cleanup


# Test existing directory cleanup
def test_clone_repository_cleanup_existing(git_service, mock_repo_clone, tmp_path):
    repo_url = "https://github.com/python/cpython.git"
    repo_path = tmp_path / "repos" / "cpython"
    repo_path.mkdir(parents=True)  # Create directory to simulate existing repo

    repo_id = git_service.clone_repository(repo_url)

    assert repo_id == "cpython"
    mock_repo_clone.assert_called_once_with(repo_url, repo_path)
    assert repo_path.exists()


# Test Git cloning failure
def test_clone_repository_git_error(git_service, mock_repo_clone, tmp_path):
    repo_url = "https://github.com/python/cpython.git"
    mock_repo_clone.side_effect = Exception("Git clone failed")

    with pytest.raises(HTTPException) as exc:
        git_service.clone_repository(repo_url)
    assert exc.value.status_code == 500
    assert "Failed to clone repository: Git clone failed" in exc.value.detail
    assert not (tmp_path / "repos" / "cpython").exists()  # Ensure cleanup

