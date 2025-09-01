const express = require('express');
const router = express.Router();
const doacaoController = require('../controllers/doacaoController');

// Registra uma doação
router.post('/', doacaoController.registrarDoacao);

// Lista todas as doações
router.get('/', doacaoController.listarDoacoes);

module.exports = router;