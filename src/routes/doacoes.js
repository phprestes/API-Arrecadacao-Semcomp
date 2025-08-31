const express = require('express');
const router = express.Router();
const doacaoController = require('../controllers/doacaoController');

router.post('/', doacaoController.registrarDoacao);
router.get('/', doacaoController.listarDoacoes);

module.exports = router;