const mongoose = require('mongoose');

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
  ativa: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Casa', casaSchema);