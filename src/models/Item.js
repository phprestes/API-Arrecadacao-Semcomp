const mongoose = require('mongoose');

/* Estrutura do Item
 * -----------------
 * nome - Nome do item (identificador único)
 * valorFixo - Valor inicial do item, pode ser o preço do item em mercado
 * quantidadeMax - Quantidade máxima do item antes de decair para o próximo tier
 * quantidadeTier - Quanto do item foi doado no tier atual
 * quantidadeTotal - Quanto do item foi doado no total
 * tierNivel- Tier atual do item que vai definir seu multiplicador
*/
const itemSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    unique: true
  },
  valorFixo: {
    type: Number,
    required: true,
    min: 0
  },
  quantidadeMax: {
    type: Number,
    required: true,
    min: 1
  },
  quantidadeTier: {
    type: Number,
    default: 0
  },
  quantidadeTotal: {
    type: Number,
    default: 0
  },
  tierNivel: {
    type: Number, 
    required: true
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Item', itemSchema);