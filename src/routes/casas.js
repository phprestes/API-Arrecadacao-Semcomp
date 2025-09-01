const express = require('express');
const router = express.Router();
const casaController = require('../controllers/casaController');

// Criar uma nova casa
router.post('/', casaController.criarCasa);

// Listar todas as casas
router.get('/', casaController.listarCasas);

// Obter uma casa específica
router.get('/:nome', casaController.obterCasa);

// Atualizar uma casa
router.put('/:nome', casaController.atualizarCasa);

// Deletar uma casa
router.delete('/:nome', casaController.deletarCasa);

module.exports = router;