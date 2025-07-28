# SourceChat Development Guide

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Install dependencies (ensure you have Python 3.8+)
pip install -r requirements.txt

# Start the FastAPI server
python main.py
```

The backend will run on `http://localhost:8000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies (ensure you have Node.js 16+)
npm install

# Start the React development server
npm start
```

The frontend will run on `http://localhost:3000`

## Application Flow

1. **Repository Input**: User enters a GitHub repository URL
2. **Clone Process**: Backend clones the repository with progress messages:
   - "Connecting to GitHub..."
   - "Downloading repository files..."
   - "Validating repository structure..."

3. **Processing Phase**: Repository is processed for RAG with detailed status:
   - "Analyzing repository structure and files..."
   - "Extracting code content and documentation..."
   - "Creating searchable chunks for AI analysis..."
   - "Building vector embeddings for semantic search..."

4. **Chat Interface**: User can interact with the codebase using natural language

## Key Features

- **Real-time Progress**: Loading states with descriptive messages
- **Error Handling**: Comprehensive error messages with recovery options
- **Responsive Design**: Works on desktop and mobile
- **Auto-processing**: Automatic transition from clone → process → chat
- **Source References**: Chat responses include code sources and file references

## API Endpoints

- `POST /api/v1/repos/clone` - Clone repository
- `POST /api/v1/repos/{repo_id}/process` - Process for RAG
- `GET /api/v1/repos/{repo_id}/status` - Get processing status
- `POST /api/v1/repos/{repo_id}/chat` - Chat with repository
- `GET /api/v1/health` - Health check

## Environment Variables

### Backend (.env)

```
# Copy from .env.example and fill in your values
cp .env.example .env

# Required variables:
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
MAX_REPO_SIZE_MB=100
CHROMA_PERSIST_DIRECTORY=./chromadb
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:8000
```

## Testing the Workflow

1. Start both backend and frontend servers
2. Open http://localhost:3000
3. Enter a GitHub repository URL (e.g., https://github.com/microsoft/vscode)
4. Watch the progress indicators during clone and processing
5. Once processed, start chatting with the codebase

## Error Handling

The application implements robust error handling with **no retry mechanisms**:

### Error Behavior

- When any error occurs, the process **stops completely**
- No automatic retries or flickering between states
- Clear error messages with specific failure reasons
- Only recovery option is "Start Over" (full page reload)

### Error Types

- **Repository Access Errors**: Invalid URLs, private repos, network issues
- **Processing Errors**: File type issues, size limits, server processing failures
- **Chat Errors**: Communication failures during chat interactions

### Design Philosophy

- **Fail Fast**: If an error occurs, it's likely a backend issue that won't resolve with retries
- **Clear State**: No ambiguous loading/error state transitions
- **Simple Recovery**: Users start completely fresh rather than partial state recovery
