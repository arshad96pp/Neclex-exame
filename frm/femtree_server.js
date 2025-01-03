const express = require('express');
const path = require('path');

const app = express();
const port = 3400;

// Serve static files from the "dist" folder
app.use(express.static(path.join(__dirname, 'dist')));

// Serve the Vite app for any route other than the API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});