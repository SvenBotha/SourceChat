# SourceChat

**Your code, conversational.**

SourceChat is an AI-powered RAG (Retrieval-Augmented Generation) system that allows you to have natural language conversations with any GitHub repository. Simply paste a repository URL, and start asking questions about the codebase as if you're talking to an expert developer who knows every line of code.

## 🚀 Features

- **Repository Integration**: Clone and analyze any public GitHub repository
- **Intelligent Code Understanding**: Advanced embedding and chunking strategies for optimal code comprehension
- **Natural Language Queries**: Ask questions in plain English about functions, classes, architecture, and more
- **Real-time Chat Interface**: Interactive web-based chat powered by modern AI models
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
- **Tailwind CSS** for styling
- **TanStack Query** for state management
- **Axios** for API communication

### Backend

- **FastAPI** with Python 3.9+
- **LangChain** for RAG implementation
- **GitPython** for repository operations
- **Chroma** vector database
- **OpenAI** embeddings and chat completion

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

# Run the backend
uvicorn main:app --reload --port 8000
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

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# API Keys
OPENAI_API_KEY=your_openai_api_key_here

# Database
CHROMA_PERSIST_DIRECTORY=./chroma_db

# Application
MAX_REPO_SIZE_MB=500
SUPPORTED_FILE_EXTENSIONS=.py,.js,.ts,.jsx,.tsx,.java,.cpp,.c,.h,.cs,.php,.rb,.go,.rs,.swift

# Rate Limiting
REQUESTS_PER_MINUTE=60
```

## 📖 Usage

1. **Paste Repository URL**: Enter any public GitHub repository URL
2. **Wait for Processing**: SourceChat will clone and analyze the repository
3. **Start Chatting**: Ask questions about the codebase:
   - "What does the main function do?"
   - "How is authentication handled?"
   - "Show me the database models"
   - "Explain the API endpoints"
   - "What are the main components?"

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

- `POST /api/repositories` - Clone and process a repository
- `GET /api/repositories/{repo_id}` - Get repository status
- `POST /api/repositories/{repo_id}/chat` - Chat with repository
- `GET /api/repositories/{repo_id}/files` - List processed files

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

**"Repository too large" error**

- Increase `MAX_REPO_SIZE_MB` in environment variables
- Consider implementing selective file processing

**Slow embedding generation**

- Switch to smaller embedding models
- Implement chunking optimizations
- Use local embedding models for development

**API rate limits**

- Implement request queuing
- Use multiple API keys with rotation
- Consider local LLM alternatives

## 🛣️ Roadmap

- [ ] Support for private repositories
- [ ] Multiple vector database options
- [ ] Code execution capabilities
- [ ] Integration with popular IDEs
- [ ] Multi-repository conversations
- [ ] Real-time repository updates
- [ ] Team collaboration features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT and embedding models
- LangChain for RAG framework
- The open-source community for inspiration

## 📞 Support

- Create an issue for bug reports
- Start a discussion for feature requests
- Follow [@yourusername](https://twitter.com/yourusername) for updates

---

**SourceChat** - Making code conversations as natural as talking to a colleague. 🚀
