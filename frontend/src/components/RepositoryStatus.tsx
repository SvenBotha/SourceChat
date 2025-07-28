// src/components/RepositoryStatus.tsx
import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, Loader2, FileText, Database } from 'lucide-react';
import { useRepositoryStatus, useProcessRepository } from '../hooks/userRepositories';

interface RepositoryStatusProps {
  repoId: string;
  onProcessed: () => void;
}

const RepositoryStatus: React.FC<RepositoryStatusProps> = ({ repoId, onProcessed }) => {
  const { data: status, isLoading, error: statusError } = useRepositoryStatus(repoId);
  const processRepository = useProcessRepository();
  const [hasStartedProcessing, setHasStartedProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);

  // Start processing automatically when component mounts (only once)
  useEffect(() => {
    if (status && !status.processed && !hasStartedProcessing && !processingError) {
      setHasStartedProcessing(true);
      processRepository.mutate(repoId, {
        onError: (error) => {
          setProcessingError(error.message);
        }
      });
    }
  }, [status, repoId, processRepository, hasStartedProcessing, processingError]);

  // Call onProcessed when processing is complete
  useEffect(() => {
    if (status?.processed) {
      onProcessed();
    }
  }, [status?.processed, onProcessed]);

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">Loading repository status...</span>
        </div>
      </div>
    );
  }

  // Show processing error (takes priority over status error)
  if (processingError) {
    return (
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Processing Failed</h2>
            <p className="text-red-600 text-sm mt-1">{processingError}</p>
          </div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-700 dark:text-red-300">
            The repository processing failed. This could be due to:
          </p>
          <ul className="text-sm text-red-600 dark:text-red-400 mt-2 ml-4 list-disc space-y-1">
            <li>Repository contains unsupported file types</li>
            <li>Repository is too large to process</li> 
            <li>Server processing error or timeout</li>
            <li>Insufficient resources to create embeddings</li>
          </ul>
          <p className="text-sm text-red-700 dark:text-red-300 mt-3 font-medium">
            Please try a different repository or start over.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="btn-primary w-full"
        >
          Start Over
        </button>
      </div>
    );
  }

  // Show status error only if no processing error
  if (statusError) {
    return (
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Repository Error</h2>
            <p className="text-red-600 text-sm mt-1">{statusError.message}</p>
          </div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-700 dark:text-red-300">
            Unable to access this repository. This could be due to:
          </p>
          <ul className="text-sm text-red-600 dark:text-red-400 mt-2 ml-4 list-disc space-y-1">
            <li>Repository not found or is private</li>
            <li>Invalid repository URL</li> 
            <li>Network connectivity issues</li>
            <li>Server connection error</li>
          </ul>
          <p className="text-sm text-red-700 dark:text-red-300 mt-3 font-medium">
            Please check the repository URL and try again.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="btn-primary w-full"
        >
          Start Over
        </button>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <AlertCircle className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Repository Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400">Unable to find repository status</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${
          status.processed 
            ? 'bg-green-100 dark:bg-green-900' 
            : hasStartedProcessing && processRepository.isPending && !processingError
            ? 'bg-blue-100 dark:bg-blue-900'
            : 'bg-yellow-100 dark:bg-yellow-900'
        }`}>
          {status.processed ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : hasStartedProcessing && processRepository.isPending && !processingError ? (
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          ) : (
            <Clock className="w-6 h-6 text-yellow-600" />
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {status.processed 
              ? 'Repository Ready!' 
              : hasStartedProcessing && processRepository.isPending && !processingError
              ? 'Processing Repository...'
              : 'Repository Cloned'
            }
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {status.processed 
              ? 'Your repository has been processed and is ready for chat'
              : hasStartedProcessing && processRepository.isPending && !processingError
              ? 'Analyzing and indexing your codebase for better search and understanding'
              : 'Processing will begin automatically...'
            }
          </p>
        </div>
      </div>

      {/* Repository Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Files</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {status.total_files?.toLocaleString() || 'N/A'}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Size</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {status.repo_size_mb ? `${status.repo_size_mb.toFixed(1)} MB` : 'N/A'}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Chunks</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {status.chunk_count.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress Bar - only show when actively processing */}
      {!status.processed && hasStartedProcessing && processRepository.isPending && !processingError && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Processing Progress</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Please wait...</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      )}

      {/* Processing Info */}
      {status.processed && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300">
            🎉 Repository successfully processed! You can now start chatting with your codebase. 
            The AI has indexed <strong>{status.chunk_count.toLocaleString()} code chunks</strong> and 
            is ready to answer questions about your code.
          </p>
        </div>
      )}

      {/* Processing status - only show when actively processing and no errors */}
      {hasStartedProcessing && processRepository.isPending && !status.processed && !processingError && (
        <div className="mt-4 space-y-3">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Processing Repository...</p>
            </div>
            <div className="space-y-2 text-xs text-blue-600 dark:text-blue-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-pulse"></div>
                <span>Analyzing repository structure and files...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <span>Extracting code content and documentation...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                <span>Creating searchable chunks for AI analysis...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                <span>Building vector embeddings for semantic search...</span>
              </div>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-3 italic">
              This may take a few minutes depending on repository size. Please wait...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepositoryStatus;