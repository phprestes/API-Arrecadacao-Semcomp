const express = require('express');
const router = express.Router();
const tierController = require('../controllers/tierController');

// Criar um novo tier
router.post('/', tierController.criarTier);

// Listar todos os tiers
router.get('/', tierController.listarTiers);

// Obter um tier específico
router.get('/:nivel', tierController.obterTier);

// Atualizar um tier
router.put('/:nivel', tierController.atualizarTier);

// Deletar um tier
router.delete('/:nivel', tierController.deletarTier);

module.exports = router;