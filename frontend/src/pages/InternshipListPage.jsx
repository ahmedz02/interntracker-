import React, { useState, useEffect } from 'react';
import '../App.css';
import InternshipList from '../components/InternshipList';
import InternshipForm from '../components/InternshipForm';
import FilterBar from '../components/FilterBar';
import { storageService } from '../services/storage';

function InternshipListPage() {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    filterInternships();
  }, [internships, statusFilter]);

  const fetchInternships = () => {
    try {
      const data = storageService.getInternships();
      setInternships(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching internships:', error);
      setLoading(false);
    }
  };

  const filterInternships = () => {
    if (statusFilter === 'all') {
      setFilteredInternships(internships);
    } else {
      setFilteredInternships(internships.filter(i => i.status === statusFilter));
    }
  };

  const handleAdd = () => {
    setEditingInternship(null);
    setShowForm(true);
  };

  const handleEdit = (internship) => {
    setEditingInternship(internship);
    setShowForm(true);
  };

  const handleSave = (internshipData) => {
    try {
      if (editingInternship) {
        // Update existing
        storageService.updateInternship(editingInternship.id, internshipData);
      } else {
        // Create new
        storageService.addInternship(internshipData);
      }
      fetchInternships();
      setShowForm(false);
      setEditingInternship(null);
    } catch (error) {
      console.error('Error saving internship:', error);
      alert('Error: Failed to save internship. Please try again.');
    }
  };

  const handleStatusUpdate = (id, newStatus) => {
    try {
      storageService.updateInternship(id, { status: newStatus });
      fetchInternships();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      try {
        storageService.deleteInternship(id);
        fetchInternships();
      } catch (error) {
        console.error('Error deleting internship:', error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingInternship(null);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Internship Tracker</h1>
        </div>
      </header>

      {!showForm ? (
        <>
          <div className="app-controls">
            <button className="btn btn-add" onClick={handleAdd}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3.33333V12.6667M3.33333 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Add Internship
            </button>
            <FilterBar
              statusFilter={statusFilter}
              onFilterChange={setStatusFilter}
            />
          </div>
          <InternshipList
            internships={filteredInternships}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusUpdate={handleStatusUpdate}
          />
        </>
      ) : (
        <InternshipForm
          internship={editingInternship}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default InternshipListPage;
