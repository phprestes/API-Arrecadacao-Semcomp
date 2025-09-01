const Doacao = require('../models/Doacao');
const Item = require('../models/Item');
const Casa = require('../models/Casa');
const Tier = require('../models/Tier');
const calculadoraService = require('../services/calculadoraService');

const doacaoController = {
  // 1. Cria a doação
  async registrarDoacao(req, res) {
    try {
      const { itemNome, casaNome, quantidade } = req.body;

      // Verificar se item e casa existem
      const [item, casa] = await Promise.all([
        Item.findOne({ nome: { $regex: new RegExp(`^${itemNome.trim()}$`, 'i') } })
            .populate('tierNivel'),
        Casa.findOne({ nome: { $regex: new RegExp(`^${casaNome.trim()}$`, 'i') } })
      ]);

      if (!item) {
        return res.status(404).json({ error: `Item "${itemNome}" não encontrado` });
      }

      if (!casa) {
        return res.status(404).json({ error: `Casa "${casaNome}" não encontrada` });
      }

      // Calcular pontos antes de somar a quantidade atualmente doada na quantidadeDoada
      let tier = await Tier.findOne({ nivel: item.tierNivel });
      const multiplicadorAplicado = calculadoraService.calcularMultiplicador(item, tier);
      const pontosGerados = multiplicadorAplicado * item.valorFixo * quantidade;

      // Criar doação
      const doacao = new Doacao({
        item,
        casa,
        quantidade,
        pontosGerados,
        multiplicadorAplicado
      });

      // Atualizar quantidade do item
      item.quantidadeTier += quantidade;
      item.quantidadeTotal += quantidade;

      // Atualiza tier do item - Verificar rebaixamento 
      if (calculadoraService.verificarRebaixamento(item)) {
        const proximoTier = await calculadoraService.encontrarProximoTier(item.tierNivel);
        if (proximoTier) {
          item.tierNivel = proximoTier.nivel;
          item.quantidadeTier = 0;
          tier = proximoTier;
        }
      }
      
      // Atualiza o multiplicador do item
      item.multiplicadorAtual = calculadoraService.calcularMultiplicador(item, tier);

      // Atualizar pontos da casa
      casa.pontos += pontosGerados;

      // Salvar tudo em transação
      await Promise.all([
        doacao.save(),
        item.save(),
        casa.save()
      ]);

      res.status(201).json({
        doacao,
        pontosGerados,
        novoMultiplicador: item.multiplicadorAtual
      });

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // 2. Lista todas as doações
  async listarDoacoes(req, res) {
    try {
      const doacoes = await Doacao.find()
        .populate('item')
        .populate('casa');
      res.json(doacoes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = doacaoController;