const API_URL = 'http://localhost:3001/api/internships';

// Set today's date as default
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('dateApplied').value = today;

  // Try to auto-fill from page
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getJobInfo' }, (response) => {
      if (response && response.company && response.role) {
        document.getElementById('company').value = response.company;
        document.getElementById('role').value = response.role;
      }
    });
  });
});

// Handle form submission
document.getElementById('internshipForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    company: document.getElementById('company').value.trim(),
    role: document.getElementById('role').value.trim(),
    dateApplied: document.getElementById('dateApplied').value,
    status: document.getElementById('status').value
  };

  const submitButton = document.querySelector('.btn-primary');
  const messageDiv = document.getElementById('message');

  // Validate
  if (!formData.company || !formData.role || !formData.dateApplied || !formData.status) {
    showMessage('Please fill in all fields', 'error');
    return;
  }

  // Disable button
  submitButton.disabled = true;
  submitButton.textContent = 'Adding...';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      showMessage('Internship added successfully!', 'success');
      // Reset form
      document.getElementById('internshipForm').reset();
      document.getElementById('dateApplied').value = new Date().toISOString().split('T')[0];
      
      // Close popup after 1.5 seconds
      setTimeout(() => {
        window.close();
      }, 1500);
    } else {
      const error = await response.json();
      showMessage(error.error || 'Failed to add internship', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('Cannot connect to tracker. Make sure the server is running on localhost:3001', 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Add to Tracker';
  }
});

function showMessage(text, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  
  if (type === 'error') {
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 5000);
  }
}

