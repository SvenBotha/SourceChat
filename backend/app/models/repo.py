from pydantic import BaseModel, HttpUrl


class RepoInput(BaseModel):
    url: HttpUrl


class ChatQuery(BaseModel):
    repo_id: str
    question: str
