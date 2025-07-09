
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from build directory
app.use(express.static(path.join(__dirname, 'build')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'ShortsHub is running!' });
});

// Catch all handler for React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ShortsHub running on port ${PORT}`);
});
