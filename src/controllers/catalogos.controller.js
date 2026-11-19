const db = require('../config/mysql');

exports.barrios = async (req, res) => {
  const [rows] = await db.query('SELECT id, nombre, lat, lng FROM barrios ORDER BY nombre');
  res.json(rows);
};

exports.tipos = async (req, res) => {
  const [rows] = await db.query('SELECT id, nombre FROM tipos_reporte ORDER BY id');
  res.json(rows);
};

exports.estados = async (req, res) => {
  const [rows] = await db.query('SELECT id, nombre FROM estados_reporte ORDER BY id');
  res.json(rows);
};
