const express = require('express');
const router = express.Router();
const GraficoService = require('../services/graficoService');

// Endpoint para gerar o gráfico
router.get('/', async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || null;
    const itens = req.query.itens ? req.query.itens.split(',') : null;
    
    // Validar limite
    if (limite && (limite < 1 || limite > 1000)) {
      return res.status(400).json({ 
        error: 'Limite inválido. Use um valor entre 1 e 1000' 
      });
    }

    let imageBuffer;
    if (itens && itens.length > 0) {
      imageBuffer = await GraficoService.gerarGraficoItensEspecificos(itens, limite);
    } else {
      imageBuffer = await GraficoService.gerarGraficoEvolucaoValor(limite);
    }
    
    let filename = 'evolucao-valor-itens';
    if (itens) filename += `-${itens.join('-')}`;
    if (limite) filename += `-${limite}doacoes`;
    
    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', `inline; filename="${filename}.png"`);
    res.send(imageBuffer);

  } catch (error) {
    console.error('Erro no endpoint do gráfico de valor:', error);
    res.status(500).json({ 
      error: 'Erro ao gerar gráfico',
      message: error.message 
    });
  }
});

module.exports = router;