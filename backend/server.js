const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Ollama } = require('ollama');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const ollama = new Ollama({ host: 'http://localhost:11434' });

app.use(cors());
app.use(express.json());

// in K8s, we'll replace localhost with the service name "mongo-service"
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/rag_db';

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to db'))
  .catch(err => console.error('Db connection_error:', err));

app.get('/health', (req, res) => {
  res.json({ status: 'backend working' });
});

app.listen(port, () => {
  console.log(`Server : http://localhost:${port}`);
});