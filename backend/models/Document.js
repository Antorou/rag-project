const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  embedding: { 
    type: [Number], 
    required: true,
    // when mongodb vector search will be setup this field must have a specific index
  },
  metadata: {
    filename: String,
    uploadedAt: { type: Date, default: Date.now }
  }
});