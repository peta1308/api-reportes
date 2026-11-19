const { Schema, model } = require('mongoose');

const reporteSchema = new Schema(
  {
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    direccion: { type: String, required: true, trim: true },
    estadoReporteId: { type: Number, required: true },
    tipoReporteId: { type: Number, required: true },
    barrioId: { type: Number, required: true },
    fechaCreacion: { type: Date, default: Date.now },
    fechaModificacion: { type: Date, default: Date.now },
    // DBRef de Spring: { $ref: 'usuarios', $id: ObjectId }
    usuario: { type: Schema.Types.Mixed },
    usuarioAdmin: { type: Schema.Types.Mixed },
    imagenes: { type: [Schema.Types.Mixed], default: [] },
    _class: { type: String, default: 'com.reportes.urbanos.reportes_api.entity.Reporte' },
  },
  { collection: 'reportes', versionKey: false }
);

module.exports = model('Reporte', reporteSchema);
