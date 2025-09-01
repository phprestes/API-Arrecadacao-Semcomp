const mongoose = require('mongoose');

/* Estrutura da Casa
 * -----------------
 * nome - Nome da Casa (identificador único)
 * pontos - Quantidade de pontos da casa na arrecadação
*/
const casaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    unique: true
  },
  pontos: {
    type: Number,
    default: 0
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Casa', casaSchema);