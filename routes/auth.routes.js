const router = require('express').Router();
const authController = require('../controllers/auth');

router.post('/', authController.login);
router.post('/token', authController.token);



module.exports = router;