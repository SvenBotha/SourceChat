import os
from pathlib import Path
from typing import Any, Dict

from app.utils.file_processor import FileProcessor
from langchain.chains import RetrievalQA
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_openai import ChatOpenAI, OpenAIEmbeddings


class RAGService:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        if not self.openai_api_key:
            raise ValueError("OpenAI API key not found, check the environment variables.")

        self.openai_model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
        if not self.openai_model:
            raise ValueError("OpenAI model not found, check the environment variables.")

        self.embeddings = OpenAIEmbeddings(api_key=self.openai_api_key)
        self.llm = ChatOpenAI(
            api_key=self.openai_api_key, model=self.openai_model, temperature=0.1
        )

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=2000, chunk_overlap=200, separators=["\n\n", "\n", ""]
        )

        self.file_processor = FileProcessor()
        self.chroma_persist_dir = Path(
            os.getenv("CHROMA_PERSIST_DIRECTORY", "./chromadb")
        )
        self.chroma_persist_dir.mkdir(exist_ok=True)

    def process_repository(self, repo_id: str) -> Dict[str, Any]:
        """Process repository files and create embeddings."""
        repo_path = Path("repos") / repo_id

        if not repo_path.exists():
            raise FileNotFoundError(f"Repository {repo_id} not found")

        # Get processable files
        files = self.file_processor.get_code_files(repo_path)

        if not files:
            return {"status": "no_processable_files", "file_count": 0}

        # Create documents from files
        documents = []
        for file_path in files:
            try:
                content = file_path.read_text(encoding="utf-8", errors="ignore")
                # Create metadata
                metadata = {
                    "file_path": str(file_path.relative_to(repo_path)),
                    "file_name": file_path.name,
                    "file_extension": file_path.suffix,
                    "repo_id": repo_id,
                }

                doc = Document(page_content=content, metadata=metadata)
                documents.append(doc)

            except Exception as e:
                print(f"Error processing {file_path}: {e}")
                continue

        if not documents:
            return {"status": "no_readable_files", "file_count": 0}

        # Split documents into chunks
        split_docs = self.text_splitter.split_documents(documents)

        # Create vector store for this repository
        collection_name = f"repo_{repo_id}".replace("-", "_").replace(".", "_")

        vectorstore = Chroma(
            collection_name=collection_name,
            embedding_function=self.embeddings,
            persist_directory=str(self.chroma_persist_dir),
        )

        # Add documents to vector store
        vectorstore.add_documents(split_docs)

        return {
            "status": "processed",
            "file_count": len(files),
            "chunk_count": len(split_docs),
            "collection_name": collection_name,
        }

    def chat_with_repository(self, repo_id: str, question: str) -> Dict[str, Any]:
        """Chat with a processed repository."""
        collection_name = f"repo_{repo_id}".replace("-", "_").replace(".", "_")

        try:
            # Load existing vector store
            vectorstore = Chroma(
                collection_name=collection_name,
                embedding_function=self.embeddings,
                persist_directory=str(self.chroma_persist_dir),
            )

            # Create retrieval chain
            qa_chain = RetrievalQA.from_chain_type(
                llm=self.llm,
                chain_type="stuff",
                retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
                return_source_documents=True,
            )

            # Add context to the question
            enhanced_question = f"""
            You are analyzing the codebase for repository '{repo_id}'. 
            Please provide a helpful and detailed answer based on the code context.
            
            Question: {question}
            
            Please include relevant code snippets and file references in your answer.
            """

            # Get response
            result = qa_chain.invoke({"query": enhanced_question})

            # Format source documents
            sources = []
            for doc in result.get("source_documents", []):
                sources.append(
                    {
                        "file_path": doc.metadata.get("file_path", "unknown"),
                        "file_name": doc.metadata.get("file_name", "unknown"),
                        "content_preview": doc.page_content[:200] + "..."
                        if len(doc.page_content) > 200
                        else doc.page_content,
                    }
                )

            return {"answer": result["result"], "sources": sources, "repo_id": repo_id}

        except Exception as e:
            raise Exception(f"Error chatting with repository: {str(e)}")

    def get_repository_status(self, repo_id: str) -> Dict[str, Any]:
        """Check if a repository has been processed for RAG."""
        collection_name = f"repo_{repo_id}".replace("-", "_").replace(".", "_")

        try:
            vectorstore = Chroma(
                collection_name=collection_name,
                embedding_function=self.embeddings,
                persist_directory=str(self.chroma_persist_dir),
            )

            # Try to get collection info
            collection = vectorstore._collection
            count = collection.count()

            return {
                "processed": count > 0,
                "chunk_count": count,
                "collection_name": collection_name,
            }

        except Exception:
            return {
                "processed": False,
                "chunk_count": 0,
                "collection_name": collection_name,
            }
