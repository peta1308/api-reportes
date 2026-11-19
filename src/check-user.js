require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const EMAIL = 'pepeperez72727@gmail.com';
const PASSWORD = '123456';

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  console.log('Base de datos:', db.databaseName);

  const cols = (await db.listCollections().toArray()).map((c) => c.name);
  console.log('Colecciones:', cols.join(', '));

  const usuarios = db.collection('usuarios');
  console.log('Total usuarios:', await usuarios.countDocuments());

  const u = await usuarios.findOne({ email: new RegExp(`^${EMAIL}$`, 'i') });
  if (!u) {
    console.log('❌ No existe un usuario con ese email');
    const muestra = await usuarios.find({}, { projection: { email: 1, verificado: 1 } }).limit(5).toArray();
    console.log('Ejemplos de emails que sí existen:', muestra);
  } else {
    console.log('✅ Usuario encontrado. verificado =', u.verificado, '| rol =', u.rol);
    console.log('Formato del password:', String(u.password).slice(0, 4), '(bcrypt empieza con $2a$, $2b$ o $2y$)');
    const ok = await bcrypt.compare(PASSWORD, String(u.password)).catch(() => false);
    console.log(ok ? '✅ La contraseña coincide' : '❌ La contraseña NO coincide');
  }
  process.exit();
})().catch((e) => { console.error(e.message); process.exit(1); });