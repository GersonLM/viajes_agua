const mongoose = require('mongoose');

const periodoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    default: function() {
      return `Periodo ${new Date().toLocaleDateString('es-SV')}`;
    }
  },
  fechaInicio: {
    type: Date,
    default: Date.now
  },
  fechaFin: {
    type: Date,
    default: null
  },
  montoTotal: {
    type: Number,
    default: 10.00
  },
  estado: {
    type: String,
    enum: ['activo', 'cerrado', 'pagado'],
    default: 'activo'
  },
  fechaPago: {
    type: Date,
    default: null
  },
  totalViajes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Método para calcular total de viajes
periodoSchema.methods.calcularTotalViajes = async function() {
  const Registro = mongoose.model('Registro');
  const count = await Registro.countDocuments({ periodo: this._id });
  this.totalViajes = count;
  return count;
};

module.exports = mongoose.model('Periodo', periodoSchema);
