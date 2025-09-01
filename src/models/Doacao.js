const mongoose = require('mongoose');

/* Estrutura da Doação
 * -----------------
 * item - Item o qual a doação foi feita
 * casa - Qual casa foi responsável pela doação
 * quantidade - Quantos itens foram doados
*/
const doacaoSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  casa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Casa',
    required: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 1
  },
  multiplicadorAplicado: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Doacao', doacaoSchema);