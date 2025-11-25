import React, { useState, useEffect } from 'react';
import './InternshipForm.css';

const STATUS_OPTIONS = ['Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];

function InternshipForm({ internship, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    dateApplied: '',
    status: 'Applied'
  });

  useEffect(() => {
    if (internship) {
      setFormData({
        company: internship.company || '',
        role: internship.role || '',
        dateApplied: internship.dateApplied || '',
        status: internship.status || 'Applied'
      });
    } else {
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        company: '',
        role: '',
        dateApplied: today,
        status: 'Applied'
      });
    }
  }, [internship]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.company && formData.role && formData.dateApplied && formData.status) {
      onSave(formData);
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <div className="form-container">
      <h2>{internship ? 'Edit Internship' : 'Add New Internship'}</h2>
      <form onSubmit={handleSubmit} className="internship-form">
        <div className="form-group">
          <label htmlFor="company">Company Name *</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g., Google, Microsoft, Amazon"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role/Posting *</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g., Software Engineering Intern, Data Science Intern"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dateApplied">Date Applied *</label>
          <input
            type="date"
            id="dateApplied"
            name="dateApplied"
            value={formData.dateApplied}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status *</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            {STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {internship ? 'Update' : 'Add'} Internship
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default InternshipForm;

