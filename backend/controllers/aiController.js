const Document = require('../models/Document');
const { Ollama } = require('ollama');
const ollama = new Ollama({ host: process.env.OLLAMA_HOST || 'http://localhost:11434' });

// Math for comparing two vectors (Cosine Similarity)
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magA * magB);
};

exports.ingestDocument = async (req, res) => {
  try {
    const { content, filename } = req.body;
    if (!content) return res.status(400).json({ error: "No content" });

    const response = await ollama.embeddings({ model: 'nomic-embed-text', prompt: content });
    
    const newDoc = new Document({
      content,
      embedding: response.embedding,
      metadata: { filename }
    });

    await newDoc.save();
    res.status(201).json({ message: "Ingested!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.chatWithContext = async (req, res) => {
  try {
    const { question } = req.body;

    // 1 vectorize the question
    const embeddingRes = await ollama.embeddings({ model: 'nomic-embed-text', prompt: question });
    const qEmbed = embeddingRes.embedding;

    // 2 manual Retrieval
    const allDocs = await Document.find({});
    
    // sort documents by similarity to the question
    const rankedDocs = allDocs.map(doc => ({
      ...doc._doc,
      similarity: cosineSimilarity(qEmbed, doc.embedding)
    })).sort((a, b) => b.similarity - a.similarity);

    if (rankedDocs.length === 0 || rankedDocs[0].similarity < 0.3) {
      return res.status(404).json({ message: "I don't have enough context to answer that." });
    }

    const context = rankedDocs[0].content;

    // 3 chat with Llama
    const response = await ollama.chat({
      model: 'llama3.2:1b',
      messages: [
        { role: 'system', content: `Context: ${context}. Answer based ONLY on this.` },
        { role: 'user', content: question }
      ],
    });

    res.json({ answer: response.message.content, source: rankedDocs[0].metadata.filename });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};