const mongoose = require('mongoose');

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
  pontosGerados: {
    type: Number,
    required: true
  },
  multiplicadorAplicado: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Doacao', doacaoSchema);