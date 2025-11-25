import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { hashPassword, comparePassword } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize users file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

// Read users from file
export const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Write users to file
export const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Get user by email
export const getUserByEmail = (email) => {
  const users = readUsers();
  return users.find(user => user.email === email);
};

// Get user by ID
export const getUserById = (id) => {
  const users = readUsers();
  return users.find(user => user.id === id);
};

// Create new user
export const createUser = async (email, password) => {
  const users = readUsers();
  
  // Check if user already exists
  if (getUserByEmail(email)) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await hashPassword(password);
  const newUser = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeUsers(users);
  
  // Create user-specific internships file
  const userInternshipsFile = path.join(DATA_DIR, `internships_${newUser.id}.json`);
  fs.writeFileSync(userInternshipsFile, JSON.stringify([], null, 2));

  return newUser;
};

// Verify user credentials
export const verifyUser = async (email, password) => {
  const user = getUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    return null;
  }

  return user;
};

