const mongoose = require('mongoose');

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
  quantidadeDoada: {
    type: Number,
    default: 0
  },
  tierAtual: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tier',
    required: true
  },
  multiplicadorAtual: {
    type: Number,
    default: 1
  },
  valorFinal: {
    type: Number,
    default: 0
  },
  maxDoacoesTier: {
    type: Number,
    default: 0
  },
  ativo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Item', itemSchema);