const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Counter for generated items
let itemCounter = 0;

// Endpoint to load more content (infinite scroll)
app.get('/api/load', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const count = parseInt(req.query.count) || 5;
  
  // Generate items
  const items = [];
  for (let i = 0; i < count; i++) {
    itemCounter++;
    items.push({
      id: itemCounter,
      title: `Item ${itemCounter}`,
      content: `This is the content for item ${itemCounter}. It contains some text to make it substantial.`
    });
  }
  
  // Simulate network delay
  setTimeout(() => {
    const html = items.map(item => `
      <div class="item" 
           data-item-id="${item.id}"
           hx-ext="intersect"
           hx-trigger="intersect"
           intersect-unload="content"
           intersect-unload-delay="500"
           intersect-unload-placeholder="<div class='item-placeholder'>Item ${item.id} unloaded</div>">
        <h3>${item.title}</h3>
        <p>${item.content}</p>
        <div class="item-data" data-loaded="true">Loaded at ${new Date().toISOString()}</div>
      </div>
    `).join('');
    
    res.send(html);
  }, 100);
});

// Endpoint to simulate unload tracking
app.post('/api/unload', (req, res) => {
  res.json({ success: true, message: 'Unload tracked' });
});

// Reset counter for testing
app.post('/api/reset', (req, res) => {
  itemCounter = 0;
  res.json({ success: true, message: 'Counter reset' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', itemCounter });
});

const server = app.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = { app, server };
