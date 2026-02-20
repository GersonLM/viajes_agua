# API de Viajes de Agua - Backend

API REST desarrollada con Node.js, Express y MongoDB para gestionar el registro de viajes de agua.

## 🚀 Instalación

```bash
cd backend
npm install
```

## ⚙️ Configuración

1. Asegúrate de tener MongoDB instalado y corriendo en tu máquina
2. El archivo `.env` ya está configurado con:
   - Puerto: 3000
   - MongoDB URI: mongodb://localhost:27017/viajes-agua-db

## 🏃 Ejecución

### Modo desarrollo (con nodemon):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📋 Endpoints API

### Períodos

- `GET /api/periodos` - Obtener todos los períodos
- `GET /api/periodos/activo` - Obtener período activo actual
- `GET /api/periodos/:id` - Obtener período por ID
- `POST /api/periodos` - Crear nuevo período
- `PUT /api/periodos/:id` - Actualizar período
- `PUT /api/periodos/:id/cerrar` - Cerrar período
- `PUT /api/periodos/:id/pagar` - Marcar período como pagado
- `DELETE /api/periodos/:id` - Eliminar período

### Registros

- `GET /api/registros` - Obtener todos los registros
- `GET /api/registros/periodo/:periodoId` - Obtener registros por período
- `GET /api/registros/:id` - Obtener registro por ID
- `POST /api/registros` - Crear nuevo registro
- `PUT /api/registros/:id` - Actualizar registro
- `DELETE /api/registros/:id` - Eliminar registro

## 📊 Modelos de Datos

### Periodo
```javascript
{
  nombre: String,
  fechaInicio: Date,
  fechaFin: Date,
  montoTotal: Number (default: 10.00),
  estado: String (activo | cerrado | pagado),
  fechaPago: Date,
  totalViajes: Number
}
```

### Registro
```javascript
{
  periodo: ObjectId (ref: Periodo),
  fecha: Date,
  motivo: String (default: "Viaje de agua"),
  notas: String
}
```

## 💡 Lógica de Negocio

- Cada 5 viajes = $10.00
- Solo puede haber un período activo a la vez
- No se pueden agregar registros a períodos cerrados o pagados
- Al cerrar un período, se registra la fecha de fin
- Al marcar como pagado, se registra la fecha de pago
- El total de viajes se calcula automáticamente
