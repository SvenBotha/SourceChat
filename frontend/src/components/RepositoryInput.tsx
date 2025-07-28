// src/components/RepositoryInput.tsx
import React, { useState } from 'react';
import { Github, Loader2 } from 'lucide-react';
import { useCloneRepository } from '../hooks/userRepositories';

interface RepositoryInputProps {
  onRepositoryCloned: (repoId: string) => void;
}

const RepositoryInput: React.FC<RepositoryInputProps> = ({ onRepositoryCloned }) => {
  const [url, setUrl] = useState('');
  const cloneRepository = useCloneRepository();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) return;

    try {
      const result = await cloneRepository.mutateAsync(url.trim());
      onRepositoryCloned(result.repo_id);
      setUrl('');
    } catch (error) {
      console.error('Clone failed:', error);
    }
  };

  const isValidGithubUrl = (url: string) => {
    return url.startsWith('https://github.com/') && url.split('/').length >= 5;
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
          <Github className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Clone Repository</h2>
          <p className="text-gray-600 dark:text-gray-400">Enter a GitHub repository URL to get started</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="repo-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            GitHub Repository URL
          </label>
          <input
            id="repo-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            className="input-field"
            disabled={cloneRepository.isPending}
          />
          {url && !isValidGithubUrl(url) && (
            <p className="mt-2 text-sm text-red-600">
              Please enter a valid GitHub repository URL
            </p>
          )}
        </div>

        {cloneRepository.error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              {cloneRepository.error.message}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={!isValidGithubUrl(url) || cloneRepository.isPending}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {cloneRepository.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Cloning git repository...
            </>
          ) : (
            <>
              <Github className="w-4 h-4" />
              Clone Repository
            </>
          )}
        </button>

        {cloneRepository.isPending && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Cloning Repository...</p>
            </div>
            <div className="space-y-1 text-xs text-blue-600 dark:text-blue-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Connecting to GitHub...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <span>Downloading repository files...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                <span>Validating repository structure...</span>
              </div>
            </div>
          </div>
        )}
      </form>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Examples:</h4>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setUrl('https://github.com/microsoft/vscode')}
            className="block text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline"
          >
            https://github.com/microsoft/vscode
          </button>
          <button
            type="button"
            onClick={() => setUrl('https://github.com/vercel/next.js')}
            className="block text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline"
          >
            https://github.com/vercel/next.js
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepositoryInput;
