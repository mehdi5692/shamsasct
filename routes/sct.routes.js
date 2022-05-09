const express = require('express');
const router = express.Router();
const sctController = require('../controllers/sct');

router.post('/', sctController.create);

router.get('/', sctController.fetchAll);

module.exports = router;