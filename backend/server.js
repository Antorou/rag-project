const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const aiRoutes = require('./routes/aiRoutes');

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());

// in K8s, we'll replace localhost with the service name "mongo-service"
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/rag_db';

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to db'))
  .catch(err => console.error('Db connection_error:', err));

app.use('/api', aiRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server : http://localhost:${port}`);
});