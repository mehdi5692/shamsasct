const express = require('express');
const router = express.Router();
const sctController = require('../controllers/sct');
const refreshToken = require('../controllers/auth/refreshToken');
const verifyToken = require('../middleware/verifyToken');

router.post('/', sctController.create);

router.get('/', verifyToken, sctController.fetchAll);
router.get('/cardtable', verifyToken, sctController.cardtable);

module.exports = router;