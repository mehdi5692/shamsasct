const router = require('express').Router();
const authController = require('../controllers/auth');
const verifyToken = require('../middleware/verifyToken');

router.post('/', authController.login);
router.post('/token', authController.token);
router.get('/logout', verifyToken,authController.logout);



module.exports = router;