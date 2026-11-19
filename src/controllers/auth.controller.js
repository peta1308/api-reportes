const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toDTO = (u) => ({
  id: String(u._id),
  nombre: u.nombre,
  email: u.email,
  rol: u.rol,
});

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios' });
  }

  // Búsqueda sin distinguir mayúsculas (hay emails guardados con mayúsculas)
  const usuario = await Usuario.findOne({
    email: new RegExp(`^${escapeRegex(String(email).trim())}$`, 'i'),
  }).select('+password');

  const ok = usuario && (await bcrypt.compare(String(password), usuario.password));
  if (!ok) return res.status(401).json({ mensaje: 'Credenciales inválidas' });

  if (!usuario.verificado) {
    return res.status(403).json({ mensaje: 'Debes verificar tu correo antes de iniciar sesión' });
  }

  const token = jwt.sign(
    { id: String(usuario._id), rol: usuario.rol, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.json({ token, usuario: toDTO(usuario) });
};

exports.me = async (req, res) => {
  const usuario = await Usuario.findById(req.usuario.id);
  if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  res.json(toDTO(usuario));
};
