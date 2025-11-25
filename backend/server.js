import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateToken, authenticateToken } from './auth.js';
import { createUser, verifyUser } from './userStorage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Internship Tracker API',
    endpoints: {
      'POST /api/auth/signup': 'Sign up new user',
      'POST /api/auth/login': 'Login user',
      'GET /api/internships': 'Get all internships (requires auth)',
      'GET /api/internships/:id': 'Get single internship (requires auth)',
      'POST /api/internships': 'Create new internship (requires auth)',
      'PUT /api/internships/:id': 'Update internship (requires auth)',
      'DELETE /api/internships/:id': 'Delete internship (requires auth)'
    }
  });
});

// Helper function to get user's internships file path
const getUserInternshipsFile = (userId) => {
  return path.join(DATA_DIR, `internships_${userId}.json`);
};

// Helper function to read user's internships
const readUserInternships = (userId) => {
  const filePath = getUserInternshipsFile(userId);
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write user's internships
const writeUserInternships = (userId, internships) => {
  const filePath = getUserInternshipsFile(userId);
  fs.writeFileSync(filePath, JSON.stringify(internships, null, 2));
};

// Authentication Routes

// Sign up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await createUser(email, password);
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await verifyUser(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Protected Routes - All require authentication

// GET all internships for the authenticated user
app.get('/api/internships', authenticateToken, (req, res) => {
  const internships = readUserInternships(req.userId);
  res.json(internships);
});

// GET single internship by ID
app.get('/api/internships/:id', authenticateToken, (req, res) => {
  const internships = readUserInternships(req.userId);
  const internship = internships.find(i => i.id === req.params.id);
  if (!internship) {
    return res.status(404).json({ error: 'Internship not found' });
  }
  res.json(internship);
});

// POST create new internship
app.post('/api/internships', authenticateToken, (req, res) => {
  const internships = readUserInternships(req.userId);
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
  writeUserInternships(req.userId, internships);
  res.status(201).json(newInternship);
});

// PUT update internship
app.put('/api/internships/:id', authenticateToken, (req, res) => {
  const internships = readUserInternships(req.userId);
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

  writeUserInternships(req.userId, internships);
  res.json(internships[index]);
});

// DELETE internship
app.delete('/api/internships/:id', authenticateToken, (req, res) => {
  const internships = readUserInternships(req.userId);
  const filtered = internships.filter(i => i.id !== req.params.id);
  
  if (filtered.length === internships.length) {
    return res.status(404).json({ error: 'Internship not found' });
  }

  writeUserInternships(req.userId, filtered);
  res.json({ message: 'Internship deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
