const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  embedding: { type: [Number], required: true },
  metadata: {
    filename: String,
    uploadedAt: { type: Date, default: Date.now }
  }
});


module.exports = mongoose.model('Document', documentSchema);