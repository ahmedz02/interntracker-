import React, { useState, useEffect, useRef } from 'react';
import './InternshipRow.css';

const STATUS_OPTIONS = ['Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];

function InternshipRow({ internship, onEdit, onDelete, onStatusUpdate }) {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsStatusOpen(false);
      }
    };

    if (isStatusOpen) {
      // Calculate position for fixed dropdown
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setMenuPosition({
          top: rect.bottom + 4,
          left: rect.left
        });
      }
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStatusOpen]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleStatusClick = (newStatus) => {
    if (newStatus !== internship.status) {
      onStatusUpdate(internship.id, newStatus);
    }
    setIsStatusOpen(false);
  };

  return (
    <tr className="internship-row">
      <td className="company-cell">
        <span className="company-name">{internship.company}</span>
      </td>
      <td className="role-cell">
        <span className="role-text">{internship.role}</span>
      </td>
      <td className="date-cell">
        <span className="date-text">{formatDate(internship.dateApplied)}</span>
      </td>
      <td className="status-cell">
        <div className="status-dropdown" ref={dropdownRef}>
          <button
            ref={buttonRef}
            className="status-button"
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            data-status={internship.status.toLowerCase()}
          >
            {internship.status}
          </button>
          {isStatusOpen && (
            <div 
              className="status-menu"
              style={{
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`
              }}
            >
              {STATUS_OPTIONS.map(status => (
                <button
                  key={status}
                  className={`status-option ${status === internship.status ? 'active' : ''}`}
                  data-status={status.toLowerCase()}
                  onClick={() => handleStatusClick(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </td>
      <td className="actions-cell">
        <button className="action-btn edit-btn" onClick={() => onEdit(internship)} title="Edit">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.333 2.00001C11.5084 1.82464 11.7163 1.68606 11.9441 1.59331C12.1719 1.50057 12.4151 1.45581 12.6663 1.45581C12.9176 1.45581 13.1608 1.50057 13.3886 1.59331C13.6164 1.68606 13.8243 1.82464 13.9997 2.00001C14.175 2.17538 14.3136 2.38328 14.4064 2.61109C14.4991 2.8389 14.5439 3.08207 14.5439 3.33334C14.5439 3.58462 14.4991 3.82779 14.4064 4.0556C14.3136 4.28341 14.175 4.49131 13.9997 4.66668L5.33301 13.3333L1.33301 14.6667L2.66634 10.6667L11.333 2.00001Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="action-btn delete-btn" onClick={() => onDelete(internship.id)} title="Delete">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.33301 4.00001V2.66668C5.33301 2.31305 5.47348 1.97491 5.72353 1.72486C5.97358 1.47481 6.31172 1.33334 6.66634 1.33334H9.33301C9.68763 1.33334 10.0258 1.47481 10.2758 1.72486C10.5259 1.97491 10.6663 2.31305 10.6663 2.66668V4.00001M12.6663 4.00001V13.3333C12.6663 13.688 12.5249 14.0261 12.2748 14.2762C12.0248 14.5262 11.6866 14.6667 11.333 14.6667H4.66634C4.31272 14.6667 3.97458 14.5262 3.72453 14.2762C3.47448 14.0261 3.33301 13.688 3.33301 13.3333V4.00001H12.6663Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.66699 7.33334V11.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.33301 7.33334V11.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </td>
    </tr>
  );
}

export default InternshipRow;

