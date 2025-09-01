const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.post('/', itemController.criarItem);
router.get('/', itemController.listarItens);
router.get('/:nome', itemController.obterItem);

module.exports = router;