import { useState, useMemo } from 'react';

export default function AdvancedFilterPanel({ data, onFilter }) {
  const [filters, setFilters] = useState({
    searchText: '',
    dateRange: { start: '', end: '' },
    sentiment: 'all',
    source: 'all',
    sortBy: 'date-desc',
  });

  const uniqueSources = useMemo(() => {
    return [...new Set(data.map((item) => item.source || 'unknown'))];
  }, [data]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters) => {
    let filtered = [...data];

    // Text search
    if (currentFilters.searchText) {
      const searchLower = currentFilters.searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.text || '').toLowerCase().includes(searchLower) ||
          (item.message || '').toLowerCase().includes(searchLower) ||
          (item.aiResult || '').toLowerCase().includes(searchLower)
      );
    }

    // Date range filter
    if (currentFilters.dateRange.start || currentFilters.dateRange.end) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.createdAt || item.created_at);
        if (currentFilters.dateRange.start) {
          const startDate = new Date(currentFilters.dateRange.start);
          if (itemDate < startDate) return false;
        }
        if (currentFilters.dateRange.end) {
          const endDate = new Date(currentFilters.dateRange.end);
          if (itemDate > endDate) return false;
        }
        return true;
      });
    }

    // Sentiment filter
    if (currentFilters.sentiment !== 'all') {
      filtered = filtered.filter(
        (item) =>
          (item.sentiment?.label || item.level || '').toLowerCase() ===
          currentFilters.sentiment.toLowerCase()
      );
    }

    // Source filter
    if (currentFilters.source !== 'all') {
      filtered = filtered.filter((item) => (item.source || 'unknown') === currentFilters.source);
    }

    // Sorting
    const sorted = [...filtered];
    if (currentFilters.sortBy === 'date-asc') {
      sorted.sort((a, b) => new Date(a.createdAt || a.created_at) - new Date(b.createdAt || b.created_at));
    } else if (currentFilters.sortBy === 'date-desc') {
      sorted.sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));
    }

    onFilter(sorted);
  };

  return (
    <div className="advanced-filter-panel" role="search" aria-label="Advanced search filters">
      <div className="filter-grid">
        <div className="filter-group">
          <label htmlFor="search-input">Search</label>
          <input
            id="search-input"
            type="search"
            placeholder="Search text, message, or result"
            value={filters.searchText}
            onChange={(e) => handleFilterChange('searchText', e.target.value)}
            aria-label="Search query"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="date-start">From Date</label>
          <input
            id="date-start"
            type="date"
            value={filters.dateRange.start}
            onChange={(e) =>
              handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })
            }
            aria-label="Start date for filtering"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="date-end">To Date</label>
          <input
            id="date-end"
            type="date"
            value={filters.dateRange.end}
            onChange={(e) =>
              handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })
            }
            aria-label="End date for filtering"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="sentiment-select">Sentiment</label>
          <select
            id="sentiment-select"
            value={filters.sentiment}
            onChange={(e) => handleFilterChange('sentiment', e.target.value)}
            aria-label="Filter by sentiment"
          >
            <option value="all">All sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="source-select">Source</label>
          <select
            id="source-select"
            value={filters.source}
            onChange={(e) => handleFilterChange('source', e.target.value)}
            aria-label="Filter by source"
          >
            <option value="all">All sources</option>
            {uniqueSources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-select">Sort by</label>
          <select
            id="sort-select"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            aria-label="Sort by"
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
          </select>
        </div>

        <button
          className="ghost-btn"
          onClick={() => {
            setFilters({
              searchText: '',
              dateRange: { start: '', end: '' },
              sentiment: 'all',
              source: 'all',
              sortBy: 'date-desc',
            });
            onFilter(data);
          }}
          aria-label="Clear all filters"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
