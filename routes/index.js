const express = require('express');
const router = express.Router();

const sctRoutes = require('./sct.routes');
const authRoutes = require('./auth.routes');

router.use('/auth', authRoutes);
router.use('/sct', sctRoutes);

module.exports = router;
