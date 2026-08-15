export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  if (startPage > 1) {
    pages.push(
      <button
        key="first"
        onClick={() => onPageChange(1)}
        className="pagination-btn"
        aria-label="First page"
      >
        « First
      </button>
    );
  }

  if (startPage > 1) {
    pages.push(
      <span key="dots-start" className="pagination-dots">
        ...
      </span>
    );
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
        aria-label={`Page ${i}`}
        aria-current={currentPage === i ? 'page' : undefined}
      >
        {i}
      </button>
    );
  }

  if (endPage < totalPages) {
    pages.push(
      <span key="dots-end" className="pagination-dots">
        ...
      </span>
    );
  }

  if (endPage < totalPages) {
    pages.push(
      <button
        key="last"
        onClick={() => onPageChange(totalPages)}
        className="pagination-btn"
        aria-label="Last page"
      >
        Last »
      </button>
    );
  }

  return (
    <div className="pagination" role="navigation" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-btn"
        aria-label="Previous page"
      >
        ← Previous
      </button>
      {pages}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-btn"
        aria-label="Next page"
      >
        Next →
      </button>
      <span className="pagination-info" aria-live="polite">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}
