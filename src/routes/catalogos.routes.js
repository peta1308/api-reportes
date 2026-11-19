const router = require('express').Router();
const c = require('../controllers/catalogos.controller');

router.get('/barrios', c.barrios);
router.get('/tipos', c.tipos);
router.get('/estados', c.estados);

module.exports = router;
