const router = require('express').Router();
const authController = require('../controllers/auth');

router.get('/', authController.login);



module.exports = router;