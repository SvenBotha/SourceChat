# SourceChat

**Your code, conversational. 🌙 Now with Dark Mode!**

SourceChat is an AI-powered RAG (Retrieval-Augmented Generation) system that allows you to have natural language conversations with any GitHub repository. Simply paste a repository URL, and start asking questions about the codebase as if you're talking to an expert developer who knows every line of code.

## ✨ What's New

### 🆕 Latest Updates (v2.1)
- **🌗 Light/Dark Mode Toggle**: Switch between light and dark themes with persistent preference
- **🐳 Complete Docker Setup**: One-command deployment with docker-compose
- **🌙 Dark Mode First**: Beautiful dark theme enabled by default with modern design
- **📺 Full-Screen Chat**: Immersive chat experience that uses the entire viewport
- **🔧 Enhanced Error Handling**: Robust error states with clear recovery options
- **⚡ Performance Improvements**: Fixed LangChain deprecation warnings and optimized processing
- **🎨 Modern UI**: Redesigned interface with better spacing, contrast, and visual hierarchy

## 🚀 Features

- **🌗 Theme Toggle**: Switch between light and dark modes with saved preference
- **🐳 Docker Ready**: Complete containerization for easy deployment
- **📺 Full-Screen Chat Interface**: Immersive chat experience that expands to use the entire screen
- **🔄 Seamless Workflow**: Automatic progression from clone → process → chat with detailed progress indicators
- **🛡️ Robust Error Handling**: Clear error messages with fail-fast approach and simple recovery
- **Repository Integration**: Clone and analyze any public GitHub repository
- **Intelligent Code Understanding**: Advanced embedding and chunking strategies for optimal code comprehension
- **Natural Language Queries**: Ask questions in plain English about functions, classes, architecture, and more
- **Real-time Processing**: Live progress updates during repository cloning and processing
- **Smart Code Navigation**: Get answers with relevant code snippets and file references
- **Multi-language Support**: Works with popular programming languages and frameworks

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Frontend│    │   FastAPI Backend│    │  Vector Database│
│                 │◄──►│                  │◄──►│    (Chroma)     │
│  • Chat UI      │    │  • Repo Cloning  │    │  • Embeddings   │
│  • Repo Input   │    │  • Code Analysis │    │  • Similarity   │
│  • Results      │    │  • RAG Pipeline  │    │    Search       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │   LLM API    │
                       │ (OpenAI/etc) │
                       └──────────────┘
```

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Tailwind CSS** with dark mode support
- **TanStack Query** for state management and caching
- **Axios** for API communication
- **Lucide React** for modern icons
- **Responsive Design** with mobile-first approach

### Backend

- **FastAPI** with Python 3.9+
- **LangChain** for RAG implementation (latest version)
- **GitPython** for repository operations
- **Chroma** vector database for embeddings
- **OpenAI** embeddings and chat completion
- **Comprehensive Error Handling** with detailed logging

## 📋 Prerequisites

- **Node.js** 18+ and npm/yarn
- **Python** 3.9+
- **Git** installed on your system
- **OpenAI API Key** (or other LLM provider)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/sourcechat.git
cd sourcechat
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your OpenAI API key and other configurations

# Run the backend server
uvicorn main:app --reload
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### 4. Access SourceChat

Open your browser and navigate to `http://localhost:3000`

The app will launch in **dark mode** by default with a clean, modern interface. The backend API will be available at `http://localhost:8000`.

## 🐳 Docker Setup (Recommended)

The easiest way to run SourceChat is using Docker Compose, which will set up both frontend and backend automatically:

### Prerequisites
- Docker and Docker Compose installed on your system
- OpenAI API key

### Quick Start with Docker

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/sourcechat.git
cd sourcechat

# 2. Set up environment variables
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# 3. Start the application
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

That's it! The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up --build

# Remove all data (repos and embeddings)
docker-compose down -v
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# OpenAI Configuration (Required)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# Repository Configuration
MAX_REPO_SIZE_MB=100

# ChromaDB Configuration
CHROMA_PERSIST_DIRECTORY=./chromadb

# Supported File Extensions (comma-separated)
SUPPORTED_EXTENSIONS=.py,.js,.ts,.jsx,.tsx,.java,.cpp,.c,.h,.cs,.php,.rb,.go,.rs,.swift,.kt,.scala,.lua,.vim,.md,.txt,.yaml,.yml,.json,.xml,.html,.css,.scss,.sass,.sql
```

## 📖 Usage

### Step-by-Step Guide

1. **🔗 Paste Repository URL**: Enter any public GitHub repository URL in the input field
2. **⏳ Watch the Progress**: SourceChat will show detailed progress as it:
   - Connects to GitHub and downloads the repository
   - Validates the repository structure
   - Analyzes code files and creates searchable chunks
   - Builds vector embeddings for semantic search
3. **💬 Full-Screen Chat**: Once processed, the interface switches to full-screen chat mode
4. **🤖 Start Conversations**: Ask questions about the codebase:
   - "What does this project do?"
   - "How is the code structured?"
   - "Show me the main components or files"
   - "Explain the API endpoints"
   - "What are the key features?"
   - "How do I get started with this code?"

### 🔄 Error Recovery
If something goes wrong:
- **Clear Error Messages**: See exactly what failed and why
- **One-Click Recovery**: Use "Start Over" to return to the initial state
- **No Retry Confusion**: Errors halt the process cleanly without flickering states

## 🎯 Example Queries

```
- "What is the overall architecture of this project?"
- "Show me how user authentication works"
- "What are the main API endpoints and what do they do?"
- "How is error handling implemented?"
- "What testing frameworks are being used?"
- "Explain the database schema"
- "What are the key dependencies and why are they used?"
```

## 🚧 Development

### Project Structure

```
sourcechat/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── public/
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── services/
│   │   ├── routers/
│   │   └── utils/
│   ├── requirements.txt
│   └── main.py
└── README.md
```

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation powered by Swagger UI.

### Key Endpoints

- `POST /api/v1/repos/clone` - Clone a GitHub repository
- `POST /api/v1/repos/{repo_id}/process` - Process repository for RAG
- `GET /api/v1/repos/{repo_id}/status` - Get processing status
- `POST /api/v1/repos/{repo_id}/chat` - Chat with repository
- `GET /api/v1/repos` - List all repositories
- `DELETE /api/v1/repos/{repo_id}` - Delete repository
- `GET /health` - Health check endpoint

## 🔒 Security Considerations

- Repository cloning is sandboxed and limited in size
- Input validation prevents malicious repository URLs
- API rate limiting prevents abuse
- Temporary files are cleaned up after processing
- No sensitive data is stored in embeddings

## 🚀 Deployment

### Docker (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment

1. Deploy FastAPI backend to your preferred platform (Railway, Render, etc.)
2. Deploy React frontend to Vercel, Netlify, or similar
3. Configure environment variables for production
4. Set up proper CORS policies

## 🐛 Troubleshooting

### Common Issues

**"Processing Failed" or "name 'a' is not defined" errors**
- ✅ Fixed in v2.0 - Updated LangChain usage and fixed variable naming issues
- Ensure you have the latest version of the code

**"Repository too large" error**
- Increase `MAX_REPO_SIZE_MB` in environment variables
- The default limit is 100MB per repository

**Dark mode compilation errors**
- ✅ Fixed in v2.0 - Proper Tailwind CSS dark mode configuration
- Restart the frontend development server if issues persist

**LangChain deprecation warnings**
- ✅ Fixed in v2.0 - Updated to use `invoke()` instead of deprecated `__call__()`

**Missing OpenAI API key**
- Ensure `OPENAI_API_KEY` is set in your `.env` file
- Check that the `.env` file is in the `backend/` directory

**Frontend won't start**
- Run `npm install` in the frontend directory
- Check that Node.js version is 18 or higher

**Backend won't start**
- Run `pip install -r requirements.txt` in the backend directory
- Ensure Python version is 3.9 or higher

## 🛣️ Roadmap

### 🚀 v2.1 (Coming Soon)
- [ ] Light/Dark mode toggle
- [ ] Repository favorites and history
- [ ] Chat export and sharing
- [ ] Custom model selection

### 🔮 Future Versions
- [ ] Support for private repositories
- [ ] Multiple vector database options
- [ ] Code execution capabilities
- [ ] Integration with popular IDEs
- [ ] Multi-repository conversations
- [ ] Real-time repository updates
- [ ] Team collaboration features
- [ ] Mobile-responsive improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT and embedding models
- **LangChain** for the RAG framework
- **Tailwind CSS** for the beautiful dark mode design
- **React Query** for excellent state management
- **Chroma** for vector database capabilities
- **The open-source community** for inspiration and contributions

## 📞 Support

- **🐛 Bug Reports**: Create an issue with detailed reproduction steps
- **💡 Feature Requests**: Start a discussion with your ideas
- **📖 Documentation**: Check `DEVELOPMENT.md` for detailed setup guides
- **💬 Questions**: Use GitHub Discussions for community help

---

**SourceChat v2.0** - Making code conversations as natural as talking to a colleague. 🌙🚀

*Now with dark mode, full-screen chat, and enhanced error handling!*
