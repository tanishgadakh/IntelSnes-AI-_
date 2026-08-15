import { useEffect, useState } from 'react';
import { Search, Filter, Download, ChevronDown } from 'lucide-react';
import api from '../api/client';
import { SkeletonTable } from './LoadingSkeleton';
import { showToast } from './ToastNotification';
import './PredictionHistory.css';

export default function PredictionHistory() {
  const [predictions, setPredictions] = useState([]);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockData = [
          {
            id: 1,
            text: 'Great product quality! Highly recommend.',
            sentiment: 'positive',
            score: 0.95,
            date: new Date(Date.now() - 1000 * 60 * 5),
            emotions: ['joy', 'satisfaction'],
            keywords: ['quality', 'recommend'],
          },
          {
            id: 2,
            text: 'Delivery was late but product is good.',
            sentiment: 'neutral',
            score: 0.65,
            date: new Date(Date.now() - 1000 * 60 * 15),
            emotions: ['mild disappointment'],
            keywords: ['delivery', 'product'],
          },
          {
            id: 3,
            text: 'Worst experience ever. Will never order again.',
            sentiment: 'negative',
            score: 0.12,
            date: new Date(Date.now() - 1000 * 60 * 25),
            emotions: ['anger', 'frustration'],
            keywords: ['worst', 'experience'],
          },
          {
            id: 4,
            text: 'Product exceeded expectations!',
            sentiment: 'positive',
            score: 0.92,
            date: new Date(Date.now() - 1000 * 60 * 35),
            emotions: ['joy', 'surprise'],
            keywords: ['exceeded', 'expectations'],
          },
          {
            id: 5,
            text: 'Average product, nothing special.',
            sentiment: 'neutral',
            score: 0.58,
            date: new Date(Date.now() - 1000 * 60 * 45),
            emotions: ['indifference'],
            keywords: ['average', 'product'],
          },
        ];
        setPredictions(mockData);
      } catch (error) {
        showToast.error('Failed to load prediction history');
      } finally {
        setLoading(false);
      }
    };
    fetchPredictions();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = predictions.filter((p) => {
      const matchSearch = p.text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSentiment = sentimentFilter === 'all' || p.sentiment === sentimentFilter;
      return matchSearch && matchSentiment;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.date - a.date;
        case 'score':
          return b.score - a.score;
        case 'text':
          return a.text.localeCompare(b.text);
        default:
          return 0;
      }
    });

    setFilteredPredictions(filtered);
    setCurrentPage(1);
  }, [predictions, searchTerm, sentimentFilter, sortBy]);

  const paginatedData = filteredPredictions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPredictions.length / itemsPerPage);

  const handleExport = () => {
    const csv = [
      ['ID', 'Text', 'Sentiment', 'Score', 'Date'],
      ...filteredPredictions.map((p) => [
        p.id,
        `"${p.text}"`,
        p.sentiment,
        p.score,
        p.date.toLocaleString(),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prediction-history.csv';
    a.click();
    showToast.success('Exported successfully!');
  };

  if (loading) return <SkeletonTable rows={10} cols={5} />;

  return (
    <div className="prediction-history">
      <div className="history-header">
        <h2>Prediction History</h2>
        <button className="btn-export" onClick={handleExport}>
          <Download size={18} />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search predictions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <Filter size={18} />
            <select value={sentimentFilter} onChange={(e) => setSentimentFilter(e.target.value)}>
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>

          <div className="filter-group">
            <sort value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Latest First</option>
              <option value="score">Highest Score</option>
              <option value="text">Alphabetical</option>
            </sort>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Text</th>
              <th>Sentiment</th>
              <th>Score</th>
              <th>Emotions</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((prediction) => (
                <tr key={prediction.id} className={`row-${prediction.sentiment}`}>
                  <td className="text-cell">{prediction.text}</td>
                  <td>
                    <span className={`badge badge-${prediction.sentiment}`}>
                      {prediction.sentiment.charAt(0).toUpperCase() + prediction.sentiment.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{
                          width: `${prediction.score * 100}%`,
                          backgroundColor: prediction.sentiment === 'positive' ? '#4ade80' : prediction.sentiment === 'neutral' ? '#facc15' : '#f87171',
                        }}
                      ></div>
                      <span>{(prediction.score * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="emotions-list">
                      {prediction.emotions.map((emotion) => (
                        <span key={emotion} className="emotion-tag">
                          {emotion}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{prediction.date.toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">
                  No predictions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="page-info">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
