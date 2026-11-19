const db = require('../config/mysql');

const mapa = (rows) => new Map(rows.map((r) => [Number(r.id), r.nombre]));

// Devuelve mapas id -> nombre de barrios, tipos y estados (MySQL)
exports.cargarCatalogos = async () => {
  const [[barrios], [tipos], [estados]] = await Promise.all([
    db.query('SELECT id, nombre FROM barrios'),
    db.query('SELECT id, nombre FROM tipos_reporte'),
    db.query('SELECT id, nombre FROM estados_reporte'),
  ]);
  return { barrios: mapa(barrios), tipos: mapa(tipos), estados: mapa(estados) };
};
