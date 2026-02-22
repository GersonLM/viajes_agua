const { query } = require('express-validator');
const Periodo = require('../models/Periodo');
const Registro = require('../models/Registro');

// Obtener todos los períodos
exports.obtenerPeriodos = async (req, res) => {
  try {
    const periodos = await Periodo.find().sort({ fechaInicio: -1 });
    res.json(periodos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener períodos', error: error.message });
  }
};

// Obtener período activo
exports.obtenerPeriodoActivo = async (req, res) => {
  try {
    let periodo = await Periodo.findOne({ estado: 'activo' });
    
    // Si no hay período activo, crear uno nuevo
    if (!periodo) {
      periodo = await Periodo.create({});
    }
    
    // Calcular total de viajes
    await periodo.calcularTotalViajes();
    await periodo.save();
    
    res.json(periodo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener período activo', error: error.message });
  }
};

// Obtener período por ID
exports.obtenerPeriodoPorId = async (req, res) => {
  try {
    const periodo = await Periodo.findById(req.params.id);
    if (!periodo) {
      return res.status(404).json({ mensaje: 'Período no encontrado' });
    }
    
    await periodo.calcularTotalViajes();
    await periodo.save();
    
    res.json(periodo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener período', error: error.message });
  }
};

// Crear nuevo período
exports.crearPeriodo = async (req, res) => {
  try {
    const periodo = await Periodo.create(req.body);
    res.status(201).json(periodo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear período', error: error.message });
  }
};

// Actualizar período
exports.actualizarPeriodo = async (req, res) => {
  try {
    const periodo = await Periodo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!periodo) {
      return res.status(404).json({ mensaje: 'Período no encontrado' });
    }
    
    res.json(periodo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar período', error: error.message });
  }
};

// Cerrar período
exports.cerrarPeriodo = async (req, res) => {
  try {
    const periodo = await Periodo.findById(req.params.id);
    
    if (!periodo) {
      return res.status(404).json({ mensaje: 'Período no encontrado' });
    }
    
    if (periodo.estado !== 'activo') {
      return res.status(400).json({ mensaje: 'Solo se pueden cerrar períodos activos' });
    }
    
    periodo.estado = 'cerrado';
    periodo.fechaFin = new Date();
    await periodo.calcularTotalViajes();
    await periodo.save();
    
    res.json(periodo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al cerrar período', error: error.message });
  }
};

// Marcar período como pagado
exports.marcarComoPagado = async (req, res) => {
  try {
    const pagado = req.body.pagado
    console.log('pagado',pagado)
    const periodo = await Periodo.findById(req.params.id);
    
    if (!periodo) {
      return res.status(404).json({ mensaje: 'Período no encontrado' });
    }
    
    if (periodo.estado === 'activo') {
      return res.status(400).json({ mensaje: 'Debe cerrar el período antes de marcarlo como pagado' });
    }
    
    periodo.estado = pagado === true ? 'pagado' : 'pendiente de pago' ;
    periodo.fechaPago = new Date();
    await periodo.save();
    
    res.json(periodo);
  } catch (error) {
    console.log(error)
    res.status(500).json({ mensaje: 'Error al marcar período como pagado', error: error.message });
  }
};

// Eliminar período
exports.eliminarPeriodo = async (req, res) => {
  try {
    // Primero eliminar todos los registros del período
    await Registro.deleteMany({ periodo: req.params.id });
    
    const periodo = await Periodo.findByIdAndDelete(req.params.id);
    
    if (!periodo) {
      return res.status(404).json({ mensaje: 'Período no encontrado' });
    }
    
    res.json({ mensaje: 'Período eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar período', error: error.message });
  }
};
