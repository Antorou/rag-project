const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/ingest', aiController.ingestDocument);

router.post('/chat', aiController.chatWithContext);


module.exports = router;