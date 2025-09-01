const Item = require('../models/Item');
const Tier = require('../models/Tier');
const calculadoraService = require('../services/calculadoraService');

const itemController = {
  // 1. Cria o item
  async criarItem(req, res) {
    try {
      const { nome, valorFixo, quantidadeMax, tierNivel } = req.body;
      
      // Cria o item baseado no número do tier informado na requisição
      const tier = await Tier.findOne({ nivel: tierNivel });
      if (!tier) {
        return res.status(404).json({ error: 'Tier não encontrado' });
      }

      const item = new Item({
        nome,
        valorFixo,
        quantidadeMax,
        tierNivel
      });

      await item.save();
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // 2. Lista todos os itens
  async listarItens(req, res) {
    try {
      const itens = await Item.find()
      res.json(itens);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 3. Obter um pelo nome
  async obterItem(req, res) {
    try {
      const { nome } = req.params;

      const item = await Item.findOne({ 
        nome: { $regex: new RegExp(`^${nome.trim()}$`, 'i') } 
      });

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