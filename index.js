// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/todo', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json());

// Dynamically include all routes
const routesPath = path.join(__dirname, 'app', 'routes');
fs.readdirSync(routesPath).forEach(file => {
  if (file.endsWith('.js')) {
    const route = require(path.join(routesPath, file));
    app.use('/api', route);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
