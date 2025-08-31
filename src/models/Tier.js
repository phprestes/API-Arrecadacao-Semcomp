const mongoose = require('mongoose');

const tierSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    unique: true
  },
  nivel: {
    type: Number,
    required: true,
    unique: true
  },
  multiplicadorInicial: {
    type: Number,
    required: true,
    min: 1
  },
  multiplicadorMinimo: {
    type: Number,
    required: true,
    min: 1
  },
  maxDoacoes: {
    type: Number,
    required: true,
    min: 1
  },
  polinomioDecaimento: {
    type: [Number],
    default: [1, 0, 0] // Coeficientes do polinômio [a, b, c] para ax² + bx + c
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tier', tierSchema);