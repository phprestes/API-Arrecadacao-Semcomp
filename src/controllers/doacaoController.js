const Doacao = require('../models/Doacao');
const Item = require('../models/Item');
const Casa = require('../models/Casa');
const Tier = require('../models/Tier');
const calculadoraService = require('../services/calculadoraService');

const doacaoController = {
  async registrarDoacao(req, res) {
    try {
      const { itemId, casaId, quantidade } = req.body;

      // Verificar se item e casa existem
      const [item, casa] = await Promise.all([
        Item.findById(itemId).populate('tierAtual'),
        Casa.findById(casaId)
      ]);

      if (!item || !casa) {
        return res.status(404).json({ error: 'Item ou Casa não encontrados' });
      }

      if (!item.ativo || !casa.ativa) {
        return res.status(400).json({ error: 'Item ou Casa inativos' });
      }

      // Calcular pontos
      const pontosPorUnidade = calculadoraService.calcularValorFinal(
        item.valorFixo,
        item.multiplicadorAtual
      );

      const pontosTotais = pontosPorUnidade * quantidade;

      // Criar doação
      const doacao = new Doacao({
        item: itemId,
        casa: casaId,
        quantidade,
        pontosGerados: pontosTotais,
        multiplicadorAplicado: item.multiplicadorAtual
      });

      // Atualizar item e casa
      item.quantidadeDoada += quantidade;
      
      // Verificar se precisa atualizar multiplicador
      const novoMultiplicador = calculadoraService.calcularMultiplicador(
        item.tierAtual,
        item.quantidadeDoada,
        item.maxDoacoesTier
      );

      item.multiplicadorAtual = novoMultiplicador;
      item.valorFinal = calculadoraService.calcularValorFinal(
        item.valorFixo,
        novoMultiplicador
      );

      // Verificar rebaixamento
      if (calculadoraService.verificarRebaixamento(item, item.tierAtual)) {
        const proximoTier = await calculadoraService.encontrarProximoTier(item.tierAtual.nivel);
        if (proximoTier) {
          item.tierAtual = proximoTier._id;
          item.maxDoacoesTier = proximoTier.maxDoacoes;
          item.quantidadeDoada = 0;
        }
      }

      casa.pontos += pontosTotais;

      // Salvar tudo em transação
      await Promise.all([
        doacao.save(),
        item.save(),
        casa.save()
      ]);

      res.status(201).json({
        doacao,
        pontosGerados: pontosTotais,
        novoMultiplicador: item.multiplicadorAtual
      });

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

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