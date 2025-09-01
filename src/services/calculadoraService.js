const Polynomial = require('polynomial');

class CalculadoraService {
  // Calcula o valor do item
  calcularMultiplicador(item, tier) {
    // Calcula o multiplicador atual baseado no polinômio de decaimento
    const coeficientes = tier.polinomioDecaimento;
    const x = tier.multiplicadorMinimo - item.quantidadeTier / item.quantidadeMax;
    
    // Fórmula: multiplicador = polinômio de grau n de variável x 
    // Onde x é a proporção de doações em relação ao máximo
    const poly = new Polynomial(coeficientes.reverse());
    let multiplicador = poly.eval(x);
    console.log(multiplicador);
    
    // Garante que o multiplicador fique acima do mínimo
    multiplicador = Math.max(tier.multiplicadorMinimo, multiplicador);

    return parseFloat(multiplicador).toFixed(2);
  }

  // Verifica se o item precisa ser rebaixado
  verificarRebaixamento(item) {
    return item.quantidadeTier >= item.quantidadeMax;
  }

  // Encontra o próximo tier (nível inferior)
  async encontrarProximoTier(nivelAtual) {
    const Tier = require('../models/Tier');
    return await Tier.findOne({ nivel: nivelAtual - 1 });
  }
}

module.exports = new CalculadoraService();