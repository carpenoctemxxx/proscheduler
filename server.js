import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';  // Import to convert URL to path

import { loginWithPrivateKey } from './firebase/auth.js'; 
import { startPomodoro, startDailyTimer } from './timers.js';
import { saveTask, deleteTask } from './tasks.js';

// Get the current directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Serve static files (like your frontend code)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML page when the root URL is accessed
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Example API route to handle login (you can modify this based on your needs)
app.post('/login', async (req, res) => {
  const { privateKey } = req.body;
  try {
    const user = await loginWithPrivateKey(privateKey);
    res.json({ message: 'Logged in successfully', user });
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
