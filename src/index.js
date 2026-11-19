require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const mysqlPool = require('./config/mysql');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/reportes', require('./routes/reportes.routes'));
app.use('/api/catalogos', require('./routes/catalogos.routes'));

app.use((req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada' }));

app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ mensaje: err.message });
  }
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB();
    await mysqlPool.query('SELECT 1');
    console.log('MySQL conectado');
    app.listen(PORT, () => console.log(`API en puerto ${PORT}`));
  } catch (e) {
    console.error('Error de arranque:', e.message);
    process.exit(1);
  }
})();
