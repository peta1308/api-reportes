const { Schema, model } = require('mongoose');

const usuarioSchema = new Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    rol: { type: String, default: 'USER' },
    fechaCreacion: { type: Date, default: Date.now },
    verificado: { type: Boolean, default: false },
    _class: { type: String, default: 'com.reportes.urbanos.reportes_api.entity.Usuario' },
  },
  { collection: 'usuarios', versionKey: false }
);

module.exports = model('Usuario', usuarioSchema);
