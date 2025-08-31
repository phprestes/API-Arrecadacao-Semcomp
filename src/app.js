const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bolsa-valores', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/items', require('./routes/items'));
app.use('/api/tiers', require('./routes/tiers'));
app.use('/api/casas', require('./routes/casas'));
app.use('/api/doacoes', require('./routes/doacoes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API funcionando' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;