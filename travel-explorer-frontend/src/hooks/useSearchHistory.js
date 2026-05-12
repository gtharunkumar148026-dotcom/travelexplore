import { useState, useEffect } from 'react';
import searchHistoryService from '../services/searchHistory';
import { useAuth } from '../contexts/AuthContext';

export const useSearchHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadHistory = async () => {
    if (!user?.loggedIn) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchHistoryService.getHistory();
      setHistory(data);
    } catch (err) {
      setError(err.message || 'Failed to load search history');
    } finally {
      setLoading(false);
    }
  };

  const saveSearch = async (query, details) => {
    if (!user?.loggedIn) return null;
    try {
      const newEntry = await searchHistoryService.saveSearch(query, details);
      setHistory(prev => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const clearHistory = async () => {
    if (!user?.loggedIn) return;
    try {
      await searchHistoryService.clearHistory();
      setHistory([]);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

  return {
    history,
    loading,
    error,
    saveSearch,
    clearHistory,
  };
};
