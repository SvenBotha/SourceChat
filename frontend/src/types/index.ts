// src/types/index.ts
export interface Repository {
  repo_id: string;
  path: string;
  size_mb: number;
  file_count?: number;
  exists?: boolean;
}

export interface CloneResponse {
  repo_id: string;
  status: string;
  message: string;
}

export interface ProcessResponse {
  status: string;
  file_count: number;
  chunk_count: number;
  collection_name: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: ChatSource[];
}

export interface ChatSource {
  file_path: string;
  file_name: string;
  content_preview: string;
}

export interface ChatRequest {
  question: string;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
  repo_id: string;
}

export interface RepositoryStatus {
  processed: boolean;
  chunk_count: number;
  collection_name: string;
  repo_exists: boolean;
  repo_size_mb?: number;
  total_files?: number;
}

export interface ApiError {
  detail: string;
}
