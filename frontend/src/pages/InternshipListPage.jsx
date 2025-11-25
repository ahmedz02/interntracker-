import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../App.css';
import InternshipList from '../components/InternshipList';
import InternshipForm from '../components/InternshipForm';
import FilterBar from '../components/FilterBar';
import ProfileDropdown from '../components/ProfileDropdown';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

const API_URL = '/api/internships';

function InternshipListPage() {
  const { isAuthenticated, getAuthHeaders } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchInternships();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterInternships();
  }, [internships, statusFilter]);

  const fetchInternships = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: getAuthHeaders()
      });
      
      if (response.status === 401) {
        logout();
        return;
      }
      
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
      let response;
      if (editingInternship) {
        response = await fetch(`${API_URL}/${editingInternship.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(internshipData)
        });
      } else {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(internshipData)
        });
      }
      
      if (response.status === 401) {
        logout();
        return;
      }
      
      if (response.ok) {
        await fetchInternships();
        setShowForm(false);
        setEditingInternship(null);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to save internship' }));
        alert(`Error: ${errorData.error || 'Failed to save internship. Please try again.'}`);
      }
    } catch (error) {
      console.error('Error saving internship:', error);
      alert('Error: Unable to connect to server. Please make sure the backend is running.');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const internship = internships.find(i => i.id === id);
      if (internship) {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            ...internship,
            status: newStatus
          })
        });
        
        if (response.status === 401) {
          logout();
          return;
        }
        
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
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        
        if (response.status === 401) {
          logout();
          return;
        }
        
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

  // Show login/signup if not authenticated
  if (!isAuthenticated) {
    if (showSignup) {
      return <SignupPage onSwitchToLogin={() => setShowSignup(false)} />;
    }
    return <LoginPage onSwitchToSignup={() => setShowSignup(true)} />;
  }

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
          <ProfileDropdown />
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
