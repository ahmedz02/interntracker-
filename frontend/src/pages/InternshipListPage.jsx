import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import InternshipList from '../components/InternshipList';
import InternshipForm from '../components/InternshipForm';
import FilterBar from '../components/FilterBar';

const API_URL = '/api/internships';

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

  const fetchInternships = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
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

  const handleSave = async (internshipData) => {
    try {
      if (editingInternship) {
        const response = await fetch(`${API_URL}/${editingInternship.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(internshipData)
        });
        if (response.ok) {
          fetchInternships();
        }
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(internshipData)
        });
        if (response.ok) {
          fetchInternships();
        }
      }
      setShowForm(false);
      setEditingInternship(null);
    } catch (error) {
      console.error('Error saving internship:', error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const internship = internships.find(i => i.id === id);
      if (internship) {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...internship,
            status: newStatus
          })
        });
        if (response.ok) {
          fetchInternships();
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchInternships();
        }
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
          <Link to="/visualization" className="nav-link">
            View Visualization
          </Link>
        </div>
      </header>

      {!showForm ? (
        <>
          <div className="app-controls">
            <button className="btn btn-primary" onClick={handleAdd}>
              Add New Internship
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

