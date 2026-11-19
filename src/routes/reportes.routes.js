const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/reportes.controller');

router.post('/', auth, c.crear);
router.get('/mis-reportes', auth, c.misReportes);

module.exports = router;
