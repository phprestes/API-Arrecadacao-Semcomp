const mongoose = require('mongoose');

/* Estrutura do Tier
 * -----------------
 * nivel - Número representando o grau do item (identificador único)
 * multiplicadorInicial - Todo tier tem um multiplicador inicial padrão
 * multiplicadorMinimo - Todo tier tem um multiplicador minimo o qual ele não pode ficar abaixo
 * polinomioDecaimento - Array de números representando os coeficientes de um polinômio
*/
const tierSchema = new mongoose.Schema({
  nivel: {
    type: Number,
    required: true,
    unique: true
  },
  multiplicadorInicial: {
    type: Number,
    required: true,
  },
  multiplicadorMinimo: {
    type: Number,
    required: true,
  },
  polinomioDecaimento: {
    type: [Number],
    default: [1, 0, 0] // Coeficientes do polinômio [a, b, c] para ax² + bx + c
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tier', tierSchema);