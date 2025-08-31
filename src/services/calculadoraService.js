class CalculadoraService {
  // Calcula o multiplicador atual baseado no polinômio de decaimento
  calcularMultiplicador(tier, quantidadeDoada, maxDoacoesTier) {
    const [a, b, c] = tier.polinomioDecaimento;
    const x = quantidadeDoada / maxDoacoesTier;
    
    // Fórmula: multiplicador = a*x² + b*x + c
    // Onde x é a proporção de doações em relação ao máximo
    let multiplicador = a * Math.pow(x, 2) + b * x + c;
    
    // Garante que o multiplicador fique entre o mínimo e o inicial
    multiplicador = Math.max(
      tier.multiplicadorMinimo,
      Math.min(tier.multiplicadorInicial, multiplicador)
    );
    
    return parseFloat(multiplicador.toFixed(2));
  }

  // Calcula o valor final do item
  calcularValorFinal(valorFixo, multiplicador) {
    return parseFloat((valorFixo * multiplicador).toFixed(2));
  }

  // Verifica se o item precisa ser rebaixado
  verificarRebaixamento(item, tier) {
    return item.quantidadeDoada >= item.maxDoacoesTier;
  }

  // Encontra o próximo tier (nível inferior)
  async encontrarProximoTier(nivelAtual) {
    const Tier = require('../models/Tier');
    return await Tier.findOne({ nivel: nivelAtual - 1 });
  }
}

module.exports = new CalculadoraService();