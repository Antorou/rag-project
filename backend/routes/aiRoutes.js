const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/ingest', aiController.ingestDocument);


module.exports = router;