import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data', 'internships.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Internship Tracker API',
    endpoints: {
      'GET /api/internships': 'Get all internships',
      'GET /api/internships/:id': 'Get single internship',
      'POST /api/internships': 'Create new internship',
      'PUT /api/internships/:id': 'Update internship',
      'DELETE /api/internships/:id': 'Delete internship'
    }
  });
});

// Helper function to read internships
const readInternships = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write internships
const writeInternships = (internships) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(internships, null, 2));
};

// GET all internships
app.get('/api/internships', (req, res) => {
  const internships = readInternships();
  res.json(internships);
});

// GET single internship by ID
app.get('/api/internships/:id', (req, res) => {
  const internships = readInternships();
  const internship = internships.find(i => i.id === req.params.id);
  if (!internship) {
    return res.status(404).json({ error: 'Internship not found' });
  }
  res.json(internship);
});

// POST create new internship
app.post('/api/internships', (req, res) => {
  const internships = readInternships();
  const { company, role, dateApplied, status } = req.body;
  
  if (!company || !role || !dateApplied || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newInternship = {
    id: Date.now().toString(),
    company,
    role,
    dateApplied,
    status,
    createdAt: new Date().toISOString()
  };

  internships.push(newInternship);
  writeInternships(internships);
  res.status(201).json(newInternship);
});

// PUT update internship
app.put('/api/internships/:id', (req, res) => {
  const internships = readInternships();
  const index = internships.findIndex(i => i.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Internship not found' });
  }

  const { company, role, dateApplied, status } = req.body;
  internships[index] = {
    ...internships[index],
    company: company || internships[index].company,
    role: role || internships[index].role,
    dateApplied: dateApplied || internships[index].dateApplied,
    status: status || internships[index].status,
    updatedAt: new Date().toISOString()
  };

  writeInternships(internships);
  res.json(internships[index]);
});

// DELETE internship
app.delete('/api/internships/:id', (req, res) => {
  const internships = readInternships();
  const filtered = internships.filter(i => i.id !== req.params.id);
  
  if (filtered.length === internships.length) {
    return res.status(404).json({ error: 'Internship not found' });
  }

  writeInternships(filtered);
  res.json({ message: 'Internship deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

