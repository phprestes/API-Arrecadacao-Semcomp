const Item = require('../models/Item');
const Tier = require('../models/Tier');
const calculadoraService = require('../services/calculadoraService');

const itemController = {
  async criarItem(req, res) {
    try {
      const { nome, valorFixo, tierId } = req.body;
      
      const tier = await Tier.findById(tierId);
      if (!tier) {
        return res.status(404).json({ error: 'Tier não encontrado' });
      }

      const item = new Item({
        nome,
        valorFixo,
        tierAtual: tierId,
        multiplicadorAtual: tier.multiplicadorInicial,
        maxDoacoesTier: tier.maxDoacoes
      });

      item.valorFinal = calculadoraService.calcularValorFinal(
        item.valorFixo, 
        item.multiplicadorAtual
      );

      await item.save();
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async listarItens(req, res) {
    try {
      const itens = await Item.find().populate('tierAtual');
      res.json(itens);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obterItem(req, res) {
    try {
      const item = await Item.findById(req.params.id).populate('tierAtual');
      if (!item) {
        return res.status(404).json({ error: 'Item não encontrado' });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = itemController;