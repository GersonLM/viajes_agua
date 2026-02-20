const mongoose = require('mongoose');

const registroSchema = new mongoose.Schema({
  periodo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Periodo',
    required: true
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  motivo: {
    type: String,
    required: true,
    default: 'Viaje de agua'
  },
  notas: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Registro', registroSchema);
