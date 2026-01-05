const Document = require('../models/Document');
const { Ollama } = require('ollama');
const ollama = new Ollama({ host: process.env.OLLAMA_HOST || 'http://localhost:11434' });

exports.ingestDocument = async (req, res) => {
  try {
    const { content, filename } = req.body;
    if (!content) return res.status(400).json({ error: "No content provided" });

    // generate embedding
    const response = await ollama.embeddings({
      model: 'nomic-embed-text',
      prompt: content,
    });

    const newDoc = new Document({
      content,
      embedding: response.embedding,
      metadata: { filename }
    });

    await newDoc.save();
    res.status(201).json({ message: "Ingested successfully", id: newDoc._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};