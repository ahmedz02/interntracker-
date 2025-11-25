import React from 'react';
import './InternshipList.css';
import InternshipRow from './InternshipRow';

function InternshipList({ internships, onEdit, onDelete, onStatusUpdate }) {
  if (internships.length === 0) {
    return (
      <div className="empty-state">
        <p>No internships yet. Add your first application to get started.</p>
      </div>
    );
  }

  return (
    <div className="internship-list-container">
      <table className="internship-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Date Applied</th>
            <th>Status</th>
            <th className="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {internships.map(internship => (
            <InternshipRow
              key={internship.id}
              internship={internship}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusUpdate={onStatusUpdate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InternshipList;
