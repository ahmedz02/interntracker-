import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Plot from 'react-plotly.js';
import '../App.css';
import './VisualizationPage.css';

const API_URL = '/api/internships';

function VisualizationPage() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
    // Refresh data every 2 seconds to catch status updates
    const interval = setInterval(fetchInternships, 2000);
    return () => clearInterval(interval);
  }, []);

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

  const processDataForSankey = (internships) => {
    const total = internships.length;
    const applied = internships.filter(i => i.status === 'Applied').length;
    const interview = internships.filter(i => i.status === 'Interview').length;
    const offer = internships.filter(i => i.status === 'Offer').length;
    const rejected = internships.filter(i => i.status === 'Rejected').length;
    const withdrawn = internships.filter(i => i.status === 'Withdrawn').length;

    // Build node labels
    const labels = [
      'Total Applications',
      'Applied',
      'Ghosted',
      'Interview',
      'Offer',
      'Rejected',
      'Withdrawn'
    ];

    // Build source and target arrays
    const source = [];
    const target = [];
    const value = [];
    const colors = [];

    // Total Applications -> Applied (all start here)
    if (total > 0) {
      source.push(0);
      target.push(1);
      value.push(total);
      colors.push('rgba(59, 130, 246, 0.6)'); // Blue
    }

    // Applied -> Ghosted (still in Applied status)
    if (applied > 0) {
      source.push(1);
      target.push(2);
      value.push(applied);
      colors.push('rgba(107, 114, 128, 0.6)'); // Gray
    }

    // Applied -> Interview
    if (interview > 0) {
      source.push(1);
      target.push(3);
      value.push(interview);
      colors.push('rgba(245, 158, 11, 0.6)'); // Amber
    }

    // Applied -> Offer (direct offers without interview)
    // We'll show offers from both Applied and Interview
    // For simplicity, if there are more offers than interviews, some came from Applied
    const offersFromApplied = Math.max(0, offer - interview);
    if (offersFromApplied > 0) {
      source.push(1);
      target.push(4);
      value.push(offersFromApplied);
      colors.push('rgba(16, 185, 129, 0.5)'); // Green (lighter)
    }

    // Interview -> Offer
    const offersFromInterview = Math.min(offer, interview);
    if (offersFromInterview > 0) {
      source.push(3);
      target.push(4);
      value.push(offersFromInterview);
      colors.push('rgba(16, 185, 129, 0.6)'); // Green
    }

    // Applied -> Rejected (rejections that didn't go through interview)
    // Total rejections minus those from interview
    const rejectedFromInterview = Math.max(0, interview - offersFromInterview);
    const rejectedFromApplied = Math.max(0, rejected - rejectedFromInterview);
    if (rejectedFromApplied > 0) {
      source.push(1);
      target.push(5);
      value.push(rejectedFromApplied);
      colors.push('rgba(239, 68, 68, 0.6)'); // Red
    }

    // Interview -> Rejected
    if (rejectedFromInterview > 0) {
      source.push(3);
      target.push(5);
      value.push(rejectedFromInterview);
      colors.push('rgba(239, 68, 68, 0.7)'); // Red (darker)
    }

    // Applied -> Withdrawn
    if (withdrawn > 0) {
      source.push(1);
      target.push(6);
      value.push(withdrawn);
      colors.push('rgba(156, 163, 175, 0.6)'); // Gray
    }

    return {
      labels,
      source,
      target,
      value,
      colors
    };
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (internships.length === 0) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1>Application Flow Visualization</h1>
            <Link to="/" className="nav-link">
              Back to List
            </Link>
          </div>
        </header>
        <div className="empty-state">
          <p>No internship data available. Add some applications to see the visualization.</p>
        </div>
      </div>
    );
  }

  const sankeyData = useMemo(() => processDataForSankey(internships), [internships]);

  // Debug: log the data
  useEffect(() => {
    console.log('Sankey Data:', sankeyData);
    console.log('Internships:', internships);
  }, [sankeyData, internships]);

  const data = useMemo(() => {
    // Ensure we have at least one link
    if (sankeyData.source.length === 0) {
      return [];
    }
    
    return [{
      type: 'sankey',
      orientation: 'h',
      node: {
        pad: 15,
        thickness: 20,
        line: {
          color: '#e8e4df',
          width: 0.5
        },
        label: sankeyData.labels,
        color: [
          '#3b82f6', // Total Applications - Blue
          '#3b82f6', // Applied - Blue
          '#9ca3af', // Ghosted - Gray
          '#f59e0b', // Interview - Amber
          '#10b981', // Offer - Green
          '#ef4444', // Rejected - Red
          '#9ca3af'  // Withdrawn - Gray
        ]
      },
      link: {
        source: sankeyData.source,
        target: sankeyData.target,
        value: sankeyData.value,
        color: sankeyData.colors
      }
    }];
  }, [sankeyData]);

  const layout = {
    font: {
      family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      size: 14,
      color: '#3d3a35'
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    height: 600,
    margin: { l: 50, r: 50, t: 20, b: 50 }
  };

  const config = {
    displayModeBar: false,
    responsive: true
  };

  // Check if we have data to display
  if (data.length === 0 || sankeyData.source.length === 0) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1>Application Flow Visualization</h1>
            <Link to="/" className="nav-link">
              Back to List
            </Link>
          </div>
        </header>
        <div className="empty-state">
          <p>No data to visualize. Add some internships to see the flow.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Application Flow Visualization</h1>
          <Link to="/" className="nav-link">
            Back to List
          </Link>
        </div>
      </header>

      <div className="visualization-container">
        <div className="chart-container">
          {data.length > 0 ? (
            <Plot
              data={data}
              layout={layout}
              config={config}
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <div className="empty-state">
              <p>Processing chart data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VisualizationPage;

