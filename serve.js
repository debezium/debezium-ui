const express = require('express');
const path = require('path');
const fs = require('fs');
const config = require('./config'); // Import the configuration file

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));



// Endpoint to get configuration
app.get('/config', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    console.log("API request made", config.KAFKA_CONNECT_CLUSTERS);
    res.json(config);
});

// Watch for changes in the environment variable
fs.watchFile('./config.js', (curr, prev) => {
  delete require.cache[require.resolve('./config')];
  const updatedConfig = require('./config');
  console.log('Configuration updated:', updatedConfig);
});

// Handle other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
