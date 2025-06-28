
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ActiveSessionService from '@/services/activeSessionService';

export const useActiveUsers = (refreshInterval: number = 30000) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['activeUsers'],
    queryFn: ActiveSessionService.getActiveUsers,
    refetchInterval: refreshInterval,
    staleTime: 10000,
    gcTime: 60000, // Changed from cacheTime to gcTime
  });

  const activeUsersCount = data?.success ? data.data.active_users : 0;
  const sessions = data?.success ? data.data.sessions : [];

  return {
    activeUsersCount,
    sessions,
    isLoading,
    error,
    refetch
  };
};
