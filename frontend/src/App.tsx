// src/App.tsx
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Code, Github, MessageSquare, Moon, Sun } from 'lucide-react';
import RepositoryInput from './components/RepositoryInput';
import RepositoryStatus from './components/RepositoryStatus';
import ChatInterface from './components/ChatInterface';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent: React.FC = () => {
  const [currentRepoId, setCurrentRepoId] = useState<string | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleRepositoryCloned = (repoId: string) => {
    setCurrentRepoId(repoId);
    setIsProcessed(false);
  };

  const handleRepositoryProcessed = () => {
    setIsProcessed(true);
  };

  const handleStartOver = () => {
    setCurrentRepoId(null);
    setIsProcessed(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header - Hide when in chat mode */}
      {!isProcessed && (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-600 rounded-lg">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">SourceChat</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your code, conversational</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
                
                {currentRepoId && (
                  <button
                    onClick={handleStartOver}
                    className="btn-secondary text-sm"
                  >
                    Start Over
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`${isProcessed ? 'h-screen' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        {!currentRepoId ? (
          // Step 1: Repository Input
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Chat with Any Codebase
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Clone a GitHub repository and start asking questions about the code
                using natural language.
              </p>
            </div>
            
            <RepositoryInput onRepositoryCloned={handleRepositoryCloned} />
            
            {/* Features */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Github className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Clone Any Repo</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Support for public GitHub repositories of any size and language
                </p>
              </div>
              
              <div className="text-center">
                <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Code className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Smart Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  AI-powered code understanding with context-aware responses
                </p>
              </div>
              
              <div className="text-center">
                <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Natural Chat</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Ask questions in plain English and get detailed explanations
                </p>
              </div>
            </div>
          </div>
        ) : !isProcessed ? (
          // Step 2: Processing Status
          <div className="max-w-2xl mx-auto">
            <RepositoryStatus 
              repoId={currentRepoId} 
              onProcessed={handleRepositoryProcessed}
            />
          </div>
        ) : (
          // Step 3: Chat Interface - Full Screen
          <ChatInterface repoId={currentRepoId} onStartOver={handleStartOver} />
        )}
      </main>

      {/* React Query Devtools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
