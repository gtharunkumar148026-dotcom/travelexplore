// src/components/user/SearchHistory.js
import React from 'react';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import './SearchHistory.css';

const SearchHistory = () => {
  const { history, loading, error, clearHistory } = useSearchHistory();

  if (loading) return <p>Loading search history...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;
  if (!history.length) return <p>No search history yet. Start exploring!</p>;

  return (
    <div className="search-history-container">
      <div className="history-header">
        <h2>🔎 Search History</h2>
        <button className="btn btn-sm btn-outline-danger" onClick={clearHistory}>
          Clear History
        </button>
      </div>

      <div className="history-grid">
        {history.map((item) => (
          <div key={item._id} className="history-card shadow-sm">
            {item.thumbnail && (
              <img src={item.thumbnail} alt={item.title} className="history-thumbnail" />
            )}
            <div className="history-content">
              <h5 className="history-title">{item.title}</h5>
              <p className="history-extract">{item.extract}</p>
              <span className="history-timestamp">
                {new Date(item.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
