const Casa = require('../models/Casa');

const casaController = {
  // 1. Cria a casa
  async criarCasa(req, res) {
    try {
      const { nome, pontos } = req.body;
      
      const casa = new Casa({
        nome,
        pontos: pontos || 0
      });

      await casa.save();
      res.status(201).json(casa);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // 2. Lista todas as casas
  async listarCasas(req, res) {
    try {
      const casas = await Casa.find();
      res.json(casas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 3. Obter casa pelo nome
  async obterCasa(req, res) {
    try {
      const { nome } = req.params;
      
      const casa = await Casa.findOne({ 
        nome: { $regex: new RegExp(`^${nome.trim()}$`, 'i') } 
      });

      if (!casa) {
        return res.status(404).json({ error: 'Casa não encontrada' });
      }

      res.json(casa);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 4. Atualiza a casa buscando pelo nome
  async atualizarCasa(req, res) {
    try {
      const { nome } = req.params;

      const casa = await Casa.findOneAndUpdate(
        { nome: { $regex: new RegExp(`^${nome.trim()}$`, 'i') } },
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!casa) {
        return res.status(404).json({ error: 'Casa não encontrada' });
      }
      
      res.json(casa);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // 5. Deleta a casa pelo nome
  async deletarCasa(req, res) {
    try {
      const { nome } = req.params;

      const casa = await Casa.findOneAndDelete({ 
        nome: { $regex: new RegExp(`^${nome.trim()}$`, 'i') } 
      });
      
      if (!casa) {
        return res.status(404).json({ error: 'Casa não encontrada' });
      }
      
      res.json({ message: 'Casa deletada com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = casaController;