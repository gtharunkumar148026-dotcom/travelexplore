// src/hooks/useHistory.js
import { useState, useEffect, useContext, useCallback } from 'react'; // Added useCallback
import { AuthContext } from '../contexts/AuthContext';
import { saveSearchHistory, getSearchHistory, clearSearchHistory } from '../services/searchHistory';

export const useHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Wrap fetchHistory in useCallback
  const fetchHistory = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await getSearchHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  }, [user]); // Add user as dependency

  const addToHistory = async (query, type = 'search') => {
    if (!user) return;
    
    try {
      const newItem = await saveSearchHistory(query, type);
      setHistory(prev => [newItem, ...prev.filter(item => item._id !== newItem._id)]);
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  };

  const clearHistory = async () => {
    if (!user) return;
    
    try {
      await clearSearchHistory();
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const removeHistoryItem = async (id) => {
    try {
      // You'll need to add this function to your services
      await deleteSearchHistoryItem(id);
      setHistory(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error('Failed to remove history item:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setHistory([]);
    }
  }, [user, fetchHistory]); // Now includes fetchHistory in dependencies

  return {
    history,
    loading,
    addToHistory,
    clearHistory,
    removeHistoryItem,
    refreshHistory: fetchHistory
  };
};