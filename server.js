const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();

// Configuração mais robusta do CORS
app.use(cors({
  origin: '*', // Permite todas as origens (em produção, substitua pelo seu domínio)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// ... (restante do código das rotas do Google Sheets)

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});