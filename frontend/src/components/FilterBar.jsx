import React from 'react';
import './FilterBar.css';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'Applied', label: 'Applied' },
  { value: 'Interview', label: 'Interview' },
  { value: 'Offer', label: 'Offer' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Withdrawn', label: 'Withdrawn' }
];

function FilterBar({ statusFilter, onFilterChange }) {
  return (
    <div className="filter-bar">
      <span className="filter-label">Filter by status:</span>
      <div className="filter-buttons">
        {STATUS_OPTIONS.map(option => (
          <button
            key={option.value}
            className={`filter-btn ${statusFilter === option.value ? 'active' : ''}`}
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterBar;

