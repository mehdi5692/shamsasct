const express = require('express');
const router = express.Router();
const sctController = require('../controllers/sct');
const refreshToken = require('../controllers/auth/refreshToken');
const verifyToken = require('../middleware/verifyToken');

router.post('/', sctController.create);

router.get('/', verifyToken, sctController.fetchAll);
router.get('/cardtable', verifyToken, sctController.cardtable);
router.get('/allincomdocuments', verifyToken, sctController.allincomdocuments);
router.get('/allissudocuments', verifyToken, sctController.allissudocuments);
router.post('/documentatchdata', verifyToken, sctController.documentatchdata);
router.post('/atchstreamimage', verifyToken, sctController.atchstreamimage);

module.exports = router;