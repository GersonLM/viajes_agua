const Registro = require('../models/Registro');
const Periodo = require('../models/Periodo');

// Obtener todos los registros
exports.obtenerRegistros = async (req, res) => {
  try {
    const registros = await Registro.find().populate('periodo').sort({ fecha: -1 });
    res.json(registros);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener registros', error: error.message });
  }
};

// Obtener registros por período
exports.obtenerRegistrosPorPeriodo = async (req, res) => {
  try {
    const registros = await Registro.find({ periodo: req.params.periodoId }).sort({ fecha: -1 });
    res.json(registros);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener registros', error: error.message });
  }
};

// Obtener registro por ID
exports.obtenerRegistroPorId = async (req, res) => {
  try {
    const registro = await Registro.findById(req.params.id).populate('periodo');
    if (!registro) {
      return res.status(404).json({ mensaje: 'Registro no encontrado' });
    }
    res.json(registro);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener registro', error: error.message });
  }
};

// Crear nuevo registro
exports.crearRegistro = async (req, res) => {
  try {
    // Verificar que el período existe y está activo
    const periodo = await Periodo.findById(req.body.periodo);
    
    if (!periodo) {
      return res.status(404).json({ mensaje: 'Período no encontrado' });
    }
    
    if (periodo.estado !== 'activo') {
      return res.status(400).json({ mensaje: 'No se pueden agregar registros a un período cerrado o pagado' });
    }
    
    const registro = await Registro.create(req.body);
    
    // Actualizar total de viajes del período
    await periodo.calcularTotalViajes();
    await periodo.save();
    
    res.status(201).json(registro);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear registro', error: error.message });
  }
};

// Actualizar registro
exports.actualizarRegistro = async (req, res) => {
  try {
    const registro = await Registro.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('periodo');
    
    if (!registro) {
      return res.status(404).json({ mensaje: 'Registro no encontrado' });
    }
    
    res.json(registro);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar registro', error: error.message });
  }
};

// Eliminar registro
exports.eliminarRegistro = async (req, res) => {
  try {
    const registro = await Registro.findById(req.params.id);
    
    if (!registro) {
      return res.status(404).json({ mensaje: 'Registro no encontrado' });
    }
    
    const periodoId = registro.periodo;
    
    await Registro.findByIdAndDelete(req.params.id);
    
    // Actualizar total de viajes del período
    const periodo = await Periodo.findById(periodoId);
    if (periodo) {
      await periodo.calcularTotalViajes();
      await periodo.save();
    }
    
    res.json({ mensaje: 'Registro eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar registro', error: error.message });
  }
};
