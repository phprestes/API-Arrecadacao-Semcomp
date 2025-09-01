const mongoose = require('mongoose');
require('dotenv').config();

const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/bolsa-valores',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      }
    );

    console.log('✅ Conectado ao MongoDB com sucesso!');
    console.log('📊 Host:', connection.connection.host);
    console.log('🎯 Database:', connection.connection.name);
    
    return connection;
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error.message);
    process.exit(1); // Encerra a aplicação se não conectar
  }
};

// Event listeners para monitorar a conexão
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose conectado ao MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('🔴 Erro na conexão:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose desconectado do MongoDB');
});

// Fecha conexão graciosamente quando app é encerrado
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('👋 Conexão com MongoDB fechada');
  process.exit(0);
});

module.exports = connectDatabase;