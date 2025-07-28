// src/hooks/useRepositories.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { repositoryApi } from '../services/api';

// Query keys
export const queryKeys = {
  repositories: ['repositories'],
  repository: (id: string) => ['repository', id],
  repositoryStatus: (id: string) => ['repository-status', id],
};

// List repositories
export const useRepositories = () => {
  return useQuery({
    queryKey: queryKeys.repositories,
    queryFn: repositoryApi.listRepositories,
  });
};

// Get repository info
export const useRepository = (repoId: string) => {
  return useQuery({
    queryKey: queryKeys.repository(repoId),
    queryFn: () => repositoryApi.getRepositoryInfo(repoId),
    enabled: !!repoId,
  });
};

// Get repository status
export const useRepositoryStatus = (repoId: string) => {
  return useQuery({
    queryKey: queryKeys.repositoryStatus(repoId),
    queryFn: () => repositoryApi.getRepositoryStatus(repoId),
    enabled: !!repoId,
    refetchInterval: (query) => {
      // Stop polling if processed or if there's an error
      return query.state.data?.processed || query.state.error ? false : 3000;
    },
    retry: false, // Don't retry on error to prevent flickering
  });
};

// Clone repository mutation
export const useCloneRepository = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: repositoryApi.cloneRepository,
    retry: false, // Don't retry on error
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repositories });
    },
  });
};

// Process repository mutation
export const useProcessRepository = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: repositoryApi.processRepository,
    retry: false, // Don't retry on error
    onSuccess: (_, repoId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repositoryStatus(repoId) });
    },
  });
};

// Chat mutation
export const useChatWithRepository = () => {
  return useMutation({
    mutationFn: ({ repoId, question }: { repoId: string; question: string }) =>
      repositoryApi.chatWithRepository(repoId, question),
  });
};

// Delete repository mutation
export const useDeleteRepository = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: repositoryApi.deleteRepository,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repositories });
    },
  });
};
