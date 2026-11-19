const { Types } = require('mongoose');
const Reporte = require('../models/Reporte');
const { cargarCatalogos } = require('../services/catalogos');

const ESTADO_PENDIENTE = 1;

const refId = (ref) => (ref ? String(ref.oid ?? ref.$id ?? '') : null);

const toDTO = (r, cat) => ({
  id: String(r._id),
  titulo: r.titulo,
  descripcion: r.descripcion,
  direccion: r.direccion,
  estadoReporteId: Number(r.estadoReporteId),
  estado: cat.estados.get(Number(r.estadoReporteId)) || null,
  tipoReporteId: Number(r.tipoReporteId),
  tipo: cat.tipos.get(Number(r.tipoReporteId)) || null,
  barrioId: Number(r.barrioId),
  barrio: cat.barrios.get(Number(r.barrioId)) || null,
  fechaCreacion: r.fechaCreacion,
  fechaModificacion: r.fechaModificacion,
  usuarioId: refId(r.usuario),
  usuarioAdminId: refId(r.usuarioAdmin),
  imagenes: r.imagenes || [],
});

exports.crear = async (req, res) => {
  const { titulo, descripcion, direccion, tipoReporteId, barrioId, imagenes } = req.body;

  if (!titulo || !descripcion || !direccion || !tipoReporteId || !barrioId) {
    return res.status(400).json({
      mensaje: 'titulo, descripcion, direccion, tipoReporteId y barrioId son obligatorios',
    });
  }

  const cat = await cargarCatalogos();
  if (!cat.tipos.has(Number(tipoReporteId))) {
    return res.status(400).json({ mensaje: 'tipoReporteId no existe' });
  }
  if (!cat.barrios.has(Number(barrioId))) {
    return res.status(400).json({ mensaje: 'barrioId no existe' });
  }

  const reporte = await Reporte.create({
    titulo,
    descripcion,
    direccion,
    tipoReporteId: Number(tipoReporteId),
    barrioId: Number(barrioId),
    estadoReporteId: ESTADO_PENDIENTE,
    usuario: { $ref: 'usuarios', $id: new Types.ObjectId(req.usuario.id) },
    imagenes: Array.isArray(imagenes) ? imagenes : [],
  });

  res.status(201).json(toDTO(reporte.toObject(), cat));
};

exports.misReportes = async (req, res) => {
  const [reportes, cat] = await Promise.all([
    Reporte.find({ 'usuario.$id': new Types.ObjectId(req.usuario.id) })
      .sort({ fechaCreacion: -1 })
      .lean(),
    cargarCatalogos(),
  ]);

  res.json(reportes.map((r) => toDTO(r, cat)));
};
