// LocalStorage service for managing internships data
const STORAGE_KEY = 'internship_tracker_data';

export const storageService = {
  // Get all internships from localStorage
  getInternships: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  // Save all internships to localStorage
  saveInternships: (internships) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(internships));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  // Add a new internship
  addInternship: (internship) => {
    const internships = storageService.getInternships();
    const newInternship = {
      ...internship,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    internships.push(newInternship);
    storageService.saveInternships(internships);
    return newInternship;
  },

  // Update an existing internship
  updateInternship: (id, updates) => {
    const internships = storageService.getInternships();
    const index = internships.findIndex(i => i.id === id);
    
    if (index === -1) {
      return null;
    }

    internships[index] = {
      ...internships[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    storageService.saveInternships(internships);
    return internships[index];
  },

  // Delete an internship
  deleteInternship: (id) => {
    const internships = storageService.getInternships();
    const filtered = internships.filter(i => i.id !== id);
    storageService.saveInternships(filtered);
    return filtered.length !== internships.length;
  },

  // Clear all data
  clearAll: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};

