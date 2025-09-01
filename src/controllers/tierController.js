const Tier = require('../models/Tier');

const tierController = {
  // 1. Cria o tier
  async criarTier(req, res) {
    try {
      const { nivel, multiplicadorInicial, multiplicadorMinimo, polinomioDecaimento } = req.body;
      
      const tier = new Tier({
        nivel,
        multiplicadorInicial,
        multiplicadorMinimo,
        polinomioDecaimento: polinomioDecaimento || [1, 0, 0]
      });

      await tier.save();
      res.status(201).json(tier);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // 2. Lista todos os tiers
  async listarTiers(req, res) {
    try {
      const tiers = await Tier.find().sort({ nivel: -1 });
      res.json(tiers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 3. Obter um tier buscando pelo nível
  async obterTier(req, res) {
    try {
      const { nivel } = req.params;

      const tier = await Tier.findOne({ nivel });
      if (!tier) {
        return res.status(404).json({ error: 'Tier não encontrado' });
      }
      res.json(tier);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 4. Atualiza um tier buscando pelo nível
  async atualizarTier(req, res) {
    try {
      const { nivel } = req.params;

      const tier = await Tier.findOneAndUpdate(
        { nivel },
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!tier) {
        return res.status(404).json({ error: 'Tier não encontrado' });
      }
      
      res.json(tier);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // 5. Deleta um tier buscando pelo nível
  async deletarTier(req, res) {
    try {
      const { nivel } = req.params;

      const tier = await Tier.findOne({ nivel });
      
      if (!tier) {
        return res.status(404).json({ error: 'Tier não encontrado' });
      }
      
      res.json({ message: 'Tier deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = tierController;